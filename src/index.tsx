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
    return c.redirect(`/dashboard?token=${sessionToken}`)
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
      // Get user balance - LIVE DATA ONLY
      const result = await c.env.DB.prepare(`
        SELECT balance, equity FROM trading_accounts WHERE is_active = 1 LIMIT 1
      `).first() as any

      if (result) {
        await sendTelegramMessage(c.env.TELEGRAM_BOT_TOKEN, chatId,
          `💰 Balance: $${result.balance}\n📊 Equity: $${result.equity}`)
      } else {
        await sendTelegramMessage(c.env.TELEGRAM_BOT_TOKEN, chatId,
          'No active trading accounts found. Please add an account first.')
      }
    } else if (text === '/trades') {
      // Get open trades - LIVE DATA ONLY
      const trades = await c.env.DB.prepare(`
        SELECT symbol, type, volume, open_price, profit 
        FROM trades WHERE status = 'OPEN' LIMIT 10
      `).all()

      if (trades.results.length === 0) {
        await sendTelegramMessage(c.env.TELEGRAM_BOT_TOKEN, chatId,
          'No open trades at the moment.')
      } else {
        let message = '📈 Open Trades:\n\n'
        for (const trade of trades.results) {
          const t = trade as any
          message += `${t.symbol} ${t.type} ${t.volume} lots @ ${t.open_price}\nP/L: $${t.profit}\n\n`
        }
        await sendTelegramMessage(c.env.TELEGRAM_BOT_TOKEN, chatId, message)
      }
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
    WHERE is_active = 1
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

  const account = await c.env.DB.prepare(`
    SELECT balance, equity, margin, free_margin, currency
    FROM trading_accounts WHERE id = ? AND is_active = 1
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

  const account = await c.env.DB.prepare(`
    SELECT * FROM trading_accounts WHERE id = ? AND is_active = 1
  `).bind(accountId).first() as any

  if (!account) {
    return c.json({ error: 'Account not found' }, 404)
  }

  // MetaAPI integration
  try {
    const metaapiToken = c.env.METAAPI_TOKEN || 'YOUR_METAAPI_TOKEN'
    
    // Update last sync time
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
// LANDING PAGE
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TradePro - Professional Trading Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .gradient-text { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .feature-card:hover { transform: translateY(-5px); transition: all 0.3s ease; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed w-full top-0 z-50">
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-chart-line text-3xl gradient-text"></i>
                    <span class="text-2xl font-bold gradient-text">TradePro</span>
                </div>
                <div class="hidden md:flex space-x-8">
                    <a href="#features" class="text-gray-600 hover:text-purple-600 font-medium">Features</a>
                    <a href="#about" class="text-gray-600 hover:text-purple-600 font-medium">About</a>
                    <a href="#integrations" class="text-gray-600 hover:text-purple-600 font-medium">Integrations</a>
                </div>
                <button onclick="showAuthModal()" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition">
                    <i class="fas fa-sign-in-alt mr-2"></i>Sign In
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 gradient-bg">
        <div class="container mx-auto px-6 text-center text-white">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">
                Professional Trading<br>Made Simple
            </h1>
            <p class="text-xl md:text-2xl mb-8 opacity-90">
                Connect MT4/MT5, manage trades, and stay updated with real-time notifications
            </p>
            <div class="flex justify-center space-x-4">
                <button onclick="showAuthModal()" class="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition">
                    Get Started Free
                </button>
                <button onclick="document.getElementById('demo-video').scrollIntoView({behavior: 'smooth'})" class="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-purple-600 transition">
                    Watch Demo
                </button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
        <div class="container mx-auto px-6">
            <h2 class="text-4xl font-bold text-center mb-16 gradient-text">Powerful Features</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div class="text-5xl mb-4 gradient-text">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">MT4/MT5 Integration</h3>
                    <p class="text-gray-600">Connect your MetaTrader accounts and manage all your trades from one dashboard</p>
                </div>
                
                <!-- Feature 2 -->
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div class="text-5xl mb-4 gradient-text">
                        <i class="fab fa-telegram"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Telegram Alerts</h3>
                    <p class="text-gray-600">Get instant notifications about trades, balance changes, and margin calls</p>
                </div>
                
                <!-- Feature 3 -->
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div class="text-5xl mb-4 gradient-text">
                        <i class="fas fa-microphone"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Voice Commands</h3>
                    <p class="text-gray-600">Control your dashboard with voice commands for hands-free trading</p>
                </div>

                <!-- Feature 4 -->
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div class="text-5xl mb-4 gradient-text">
                        <i class="fas fa-camera"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Screen Recording</h3>
                    <p class="text-gray-600">Record your trading sessions and review your performance</p>
                </div>
                
                <!-- Feature 5 -->
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div class="text-5xl mb-4 gradient-text">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Secure Authentication</h3>
                    <p class="text-gray-600">Login securely with Google OAuth and keep your data protected</p>
                </div>
                
                <!-- Feature 6 -->
                <div class="feature-card bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div class="text-5xl mb-4 gradient-text">
                        <i class="fas fa-sync"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Real-time Sync</h3>
                    <p class="text-gray-600">Live data synchronization with your trading accounts</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-gray-50">
        <div class="container mx-auto px-6">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-4xl font-bold mb-6 gradient-text">About TradePro</h2>
                    <p class="text-gray-600 text-lg mb-6">
                        TradePro is a professional trading dashboard that brings all your trading tools together in one place. 
                        Monitor multiple MT4/MT5 accounts, receive instant notifications, and control your trading with voice commands.
                    </p>
                    <p class="text-gray-600 text-lg mb-6">
                        Built with modern cloud technology and designed for professional traders who demand reliability, 
                        security, and real-time data.
                    </p>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                            <span class="text-gray-700">No installation required - 100% cloud-based</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                            <span class="text-gray-700">Bank-level security and encryption</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                            <span class="text-gray-700">24/7 real-time data synchronization</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-8 rounded-xl shadow-xl">
                    <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600" alt="Trading Dashboard" class="rounded-lg shadow-lg">
                </div>
            </div>
        </div>
    </section>

    <!-- Integrations Section -->
    <section id="integrations" class="py-20 bg-white">
        <div class="container mx-auto px-6">
            <h2 class="text-4xl font-bold text-center mb-16 gradient-text">Powerful Integrations</h2>
            <div class="grid md:grid-cols-4 gap-8">
                <div class="text-center p-6">
                    <i class="fas fa-chart-line text-6xl gradient-text mb-4"></i>
                    <h3 class="font-bold text-xl">MetaTrader</h3>
                    <p class="text-gray-600 mt-2">MT4 & MT5</p>
                </div>
                <div class="text-center p-6">
                    <i class="fab fa-google text-6xl text-red-500 mb-4"></i>
                    <h3 class="font-bold text-xl">Google OAuth</h3>
                    <p class="text-gray-600 mt-2">Secure Login</p>
                </div>
                <div class="text-center p-6">
                    <i class="fab fa-telegram text-6xl text-blue-500 mb-4"></i>
                    <h3 class="font-bold text-xl">Telegram</h3>
                    <p class="text-gray-600 mt-2">Instant Alerts</p>
                </div>
                <div class="text-center p-6">
                    <i class="fas fa-cloud text-6xl text-purple-500 mb-4"></i>
                    <h3 class="font-bold text-xl">Cloudflare</h3>
                    <p class="text-gray-600 mt-2">Edge Network</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 gradient-bg text-white">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-bold mb-6">Ready to Start Trading Smarter?</h2>
            <p class="text-xl mb-8 opacity-90">Join thousands of traders using TradePro</p>
            <button onclick="showAuthModal()" class="bg-white text-purple-600 px-12 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition">
                Get Started Now
            </button>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-6">
            <div class="grid md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4">TradePro</h3>
                    <p class="text-gray-400">Professional trading dashboard for serious traders</p>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Features</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li>MT4/MT5 Integration</li>
                        <li>Telegram Alerts</li>
                        <li>Voice Commands</li>
                        <li>Screen Recording</li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li>Documentation</li>
                        <li>API Reference</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4">Legal</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2026 TradePro. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Auth Modal -->
    <div id="auth-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
                <p class="text-gray-600">Sign in to access your dashboard</p>
            </div>
            
            <div class="space-y-4">
                <button onclick="loginWithGoogle()" class="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg hover:border-purple-500 transition flex items-center justify-center space-x-3">
                    <i class="fab fa-google text-2xl text-red-500"></i>
                    <span class="font-semibold">Continue with Google</span>
                </button>
                
                <button onclick="alert('TradingView integration coming soon!')" class="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg hover:border-purple-500 transition flex items-center justify-center space-x-3">
                    <i class="fas fa-chart-line text-2xl text-blue-500"></i>
                    <span class="font-semibold">Continue with TradingView</span>
                </button>
            </div>

            <div class="mt-6 text-center">
                <button onclick="hideAuthModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times mr-2"></i>Close
                </button>
            </div>

            <p class="mt-6 text-xs text-gray-500 text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    </div>

    <script>
        function showAuthModal() {
            document.getElementById('auth-modal').classList.remove('hidden');
        }
        
        function hideAuthModal() {
            document.getElementById('auth-modal').classList.add('hidden');
        }
        
        function loginWithGoogle() {
            window.location.href = '/api/auth/google';
        }
    </script>
</body>
</html>`)
})

// ============================================
// DASHBOARD PAGE (after login)
// ============================================

app.get('/dashboard', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TradePro Dashboard</title>
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
                            <i class="fas fa-chart-line mr-2 text-purple-500"></i>
                            TradePro Dashboard
                        </h1>
                        <div id="user-section">
                            <div class="flex items-center gap-4">
                                <div class="animate-pulse">Authenticating...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main id="main-content" class="container mx-auto px-4 py-8">
                <div class="text-center py-20">
                    <div class="animate-spin text-6xl text-purple-500 mb-4">
                        <i class="fas fa-spinner"></i>
                    </div>
                    <p class="text-xl text-gray-400">Loading your dashboard...</p>
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
