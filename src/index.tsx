import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  TELEGRAM_BOT_TOKEN: string;
  METAAPI_TOKEN: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ============================================
// AUTHENTICATION ROUTES - GOOGLE OAUTH
// ============================================

app.get('/api/auth/google', (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/google/callback`
  const scope = 'email profile'
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}`
  
  return c.redirect(authUrl)
})

app.get('/api/auth/google/callback', async (c) => {
  const code = c.req.query('code')
  
  if (!code) {
    return c.json({ error: 'No authorization code' }, 400)
  }

  try {
    const clientId = c.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
    const clientSecret = c.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET'
    const redirectUri = `${new URL(c.req.url).origin}/api/auth/google/callback`

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    const tokens = await tokenResponse.json() as any

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })

    const userData = await userResponse.json() as any

    // Save or update user in database
    await c.env.DB.prepare(`
      INSERT INTO users (email, name, google_id, avatar_url, last_login)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        google_id = excluded.google_id,
        avatar_url = excluded.avatar_url,
        last_login = datetime('now')
    `).bind(userData.email, userData.name, userData.id, userData.picture).run()

    // Create session token
    const sessionToken = crypto.randomUUID()
    await c.env.KV.put(`session:${sessionToken}`, JSON.stringify(userData), {
      expirationTtl: 86400 // 24 hours
    })

    // Redirect to dashboard with token
    return c.redirect(`/?token=${sessionToken}`)
  } catch (error) {
    console.error('OAuth error:', error)
    return c.json({ error: 'Authentication failed' }, 500)
  }
})

app.get('/api/auth/me', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return c.json({ error: 'No token provided' }, 401)
  }

  const userData = await c.env.KV.get(`session:${token}`)
  
  if (!userData) {
    return c.json({ error: 'Invalid session' }, 401)
  }

  return c.json(JSON.parse(userData))
})

app.post('/api/auth/logout', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (token) {
    await c.env.KV.delete(`session:${token}`)
  }

  return c.json({ success: true })
})

// ============================================
// TELEGRAM INTEGRATION
// ============================================

app.post('/api/telegram/webhook', async (c) => {
  const update = await c.req.json() as any
  
  if (update.message) {
    const chatId = update.message.chat.id
    const text = update.message.text

    // Handle commands
    if (text === '/start') {
      await sendTelegramMessage(c.env.TELEGRAM_BOT_TOKEN, chatId, 
        'Welcome to Trading Dashboard! Use /connect to link your account.')
    } else if (text === '/balance') {
      // Get user balance
      const result = await c.env.DB.prepare(`
        SELECT balance, equity FROM trading_accounts WHERE is_active = 1 LIMIT 1
      `).first() as any

      if (result) {
        await sendTelegramMessage(c.env.TELEGRAM_BOT_TOKEN, chatId,
          `💰 Balance: $${result.balance}\n📊 Equity: $${result.equity}`)
      }
    } else if (text === '/trades') {
      // Get open trades
      const trades = await c.env.DB.prepare(`
        SELECT symbol, type, volume, open_price, profit 
        FROM trades WHERE status = 'OPEN' LIMIT 10
      `).all()

      let message = '📈 Open Trades:\n\n'
      for (const trade of trades.results) {
        const t = trade as any
        message += `${t.symbol} ${t.type} ${t.volume} lots @ ${t.open_price}\nP/L: $${t.profit}\n\n`
      }

      await sendTelegramMessage(c.env.TELEGRAM_BOT_TOKEN, chatId, message)
    }
  }

  return c.json({ ok: true })
})

app.post('/api/telegram/connect', async (c) => {
  const { userId, chatId } = await c.req.json()

  await c.env.DB.prepare(`
    UPDATE notification_settings 
    SET telegram_chat_id = ? 
    WHERE user_id = ?
  `).bind(chatId, userId).run()

  return c.json({ success: true })
})

app.post('/api/telegram/notify', async (c) => {
  const { userId, message } = await c.req.json()

  const settings = await c.env.DB.prepare(`
    SELECT telegram_chat_id FROM notification_settings WHERE user_id = ?
  `).bind(userId).first() as any

  if (settings?.telegram_chat_id) {
    await sendTelegramMessage(
      c.env.TELEGRAM_BOT_TOKEN,
      settings.telegram_chat_id,
      message
    )
  }

  return c.json({ success: true })
})

// ============================================
// MT4/MT5 TRADING ROUTES
// ============================================

app.get('/api/trading/accounts', async (c) => {
  const accounts = await c.env.DB.prepare(`
    SELECT id, account_type, account_number, broker, balance, equity, 
           margin, free_margin, currency, leverage, is_active
    FROM trading_accounts 
    ORDER BY created_at DESC
  `).all()

  return c.json(accounts.results)
})

app.post('/api/trading/accounts', async (c) => {
  const { userId, accountType, accountNumber, broker, apiKey, apiSecret, server } = await c.req.json()

  const result = await c.env.DB.prepare(`
    INSERT INTO trading_accounts 
    (user_id, account_type, account_number, broker, api_key, api_secret, server)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(userId, accountType, accountNumber, broker, apiKey, apiSecret, server).run()

  return c.json({ id: result.meta.last_row_id, success: true })
})

app.get('/api/trading/balance/:accountId', async (c) => {
  const accountId = c.req.param('accountId')

  // In production, this would call MT4/MT5 API or MetaAPI
  // For now, return from database
  const account = await c.env.DB.prepare(`
    SELECT balance, equity, margin, free_margin, currency
    FROM trading_accounts WHERE id = ?
  `).bind(accountId).first()

  return c.json(account)
})

app.get('/api/trading/trades/:accountId', async (c) => {
  const accountId = c.req.param('accountId')

  const trades = await c.env.DB.prepare(`
    SELECT * FROM trades 
    WHERE account_id = ? 
    ORDER BY open_time DESC 
    LIMIT 100
  `).bind(accountId).all()

  return c.json(trades.results)
})

app.post('/api/trading/sync/:accountId', async (c) => {
  const accountId = c.req.param('accountId')

  // Get account credentials
  const account = await c.env.DB.prepare(`
    SELECT * FROM trading_accounts WHERE id = ?
  `).bind(accountId).first() as any

  if (!account) {
    return c.json({ error: 'Account not found' }, 404)
  }

  // Here you would integrate with MetaAPI or broker API
  // Example MetaAPI integration:
  try {
    const metaapiToken = c.env.METAAPI_TOKEN || 'YOUR_METAAPI_TOKEN'
    
    // This is a placeholder - actual MetaAPI integration would go here
    // const response = await fetch(`https://mt-client-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${account.api_key}/state`, {
    //   headers: { 'auth-token': metaapiToken }
    // })
    
    // For now, simulate data update
    await c.env.DB.prepare(`
      UPDATE trading_accounts 
      SET last_sync = datetime('now')
      WHERE id = ?
    `).bind(accountId).run()

    return c.json({ success: true, message: 'Account synced successfully' })
  } catch (error) {
    return c.json({ error: 'Sync failed' }, 500)
  }
})

// ============================================
// CAMERA & VOICE SESSIONS
// ============================================

app.get('/api/sessions', async (c) => {
  const userId = c.req.query('userId')

  const sessions = await c.env.DB.prepare(`
    SELECT * FROM sessions 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `).bind(userId).all()

  return c.json(sessions.results)
})

app.post('/api/sessions', async (c) => {
  const { userId, sessionType, recordingUrl, duration, notes } = await c.req.json()

  const result = await c.env.DB.prepare(`
    INSERT INTO sessions (user_id, session_type, recording_url, duration, notes)
    VALUES (?, ?, ?, ?, ?)
  `).bind(userId, sessionType, recordingUrl, duration, notes).run()

  return c.json({ id: result.meta.last_row_id, success: true })
})

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  if (!botToken || botToken === 'YOUR_TELEGRAM_BOT_TOKEN') {
    console.log('Telegram message (demo mode):', text)
    return
  }

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  })
}

// ============================================
// MAIN DASHBOARD PAGE
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trading Dashboard - All Integrations</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white">
    <div id="app">
        <div class="min-h-screen">
            <!-- Header -->
            <header class="bg-gray-800 shadow-lg">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <h1 class="text-2xl font-bold">
                            <i class="fas fa-chart-line mr-2"></i>
                            Trading Dashboard
                        </h1>
                        <div id="user-section">
                            <button onclick="loginWithGoogle()" class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">
                                <i class="fab fa-google mr-2"></i>
                                Login with Google
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main id="main-content" class="container mx-auto px-4 py-8">
                <div class="text-center py-20">
                    <i class="fas fa-lock text-6xl text-gray-600 mb-4"></i>
                    <p class="text-xl text-gray-400">Please login to access the dashboard</p>
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
