# 🚀 DEPLOY TO YOUR SERVER - COMPLETE GUIDE

## ✅ SYSTEM SUCCESSFULLY PUSHED TO GITHUB!

**GitHub Repository:** https://github.com/muntaseralmuntaser/final-routiex

---

## 📦 WHAT'S IN THE REPOSITORY

Your complete trading dashboard system with:
- ✅ Professional landing page
- ✅ Google OAuth authentication
- ✅ MT4/MT5 integration
- ✅ Telegram bot
- ✅ Camera & voice features
- ✅ TradingView login UI
- ✅ All backend APIs
- ✅ Database schema
- ✅ No demo data (live only)

---

## 🖥️ DEPLOY TO ANY SERVER

### **Option 1: Deploy to Cloudflare Pages (Recommended)**

#### **Step 1: Clone Repository**
```bash
git clone https://github.com/muntaseralmuntaser/final-routiex.git
cd final-routiex
```

#### **Step 2: Install Dependencies**
```bash
npm install
```

#### **Step 3: Configure Environment Variables**
Create `.dev.vars` file:
```bash
cat > .dev.vars << 'EOF'
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
METAAPI_TOKEN=your-metaapi-token
ENVIRONMENT=development
EOF
```

#### **Step 4: Create Database**
```bash
# Login to Cloudflare
npx wrangler login

# Create production database
npx wrangler d1 create trading-db-production

# Copy the database_id from output and update wrangler.jsonc

# Apply migrations
npx wrangler d1 migrations apply trading-db-production --local

# For production
npx wrangler d1 migrations apply trading-db-production
```

#### **Step 5: Build and Test Locally**
```bash
# Build
npm run build

# Start local server
npx wrangler pages dev dist --d1=trading-db-production --local --ip 0.0.0.0 --port 3000

# Or with PM2 (if installed)
pm2 start ecosystem.config.cjs
```

#### **Step 6: Deploy to Cloudflare Pages**
```bash
# Create project
npx wrangler pages project create trading-dashboard --production-branch main

# Deploy
npm run deploy:prod

# Set production secrets
npx wrangler pages secret put GOOGLE_CLIENT_ID
npx wrangler pages secret put GOOGLE_CLIENT_SECRET
npx wrangler pages secret put TELEGRAM_BOT_TOKEN
npx wrangler pages secret put METAAPI_TOKEN
```

**Your app will be live at:** `https://trading-dashboard.pages.dev`

---

### **Option 2: Deploy to VPS/Cloud Server (Ubuntu/Linux)**

#### **Step 1: SSH to Your Server**
```bash
ssh user@your-server-ip
```

#### **Step 2: Install Node.js and PM2**
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt-get install -y git
```

#### **Step 3: Clone Repository**
```bash
cd /home/user
git clone https://github.com/muntaseralmuntaser/final-routiex.git
cd final-routiex
```

#### **Step 4: Install Dependencies**
```bash
npm install
```

#### **Step 5: Configure Environment**
```bash
nano .dev.vars
```

Add your credentials:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
METAAPI_TOKEN=your-metaapi-token
ENVIRONMENT=production
```

#### **Step 6: Setup Database**
```bash
# Create local database
npx wrangler d1 migrations apply trading-db-production --local
```

#### **Step 7: Build and Start**
```bash
# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### **Step 8: Configure Nginx (Optional)**
```bash
sudo apt-get install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/trading-dashboard
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/trading-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### **Step 9: Setup SSL (Optional)**
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### **Option 3: Deploy to Vercel**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Clone and Setup**
```bash
git clone https://github.com/muntaseralmuntaser/final-routiex.git
cd final-routiex
npm install
```

#### **Step 3: Configure for Vercel**
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "installCommand": "npm install"
}
```

#### **Step 4: Deploy**
```bash
vercel login
vercel --prod
```

#### **Step 5: Add Environment Variables**
Go to Vercel dashboard → Project → Settings → Environment Variables

Add:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `METAAPI_TOKEN`

---

### **Option 4: Deploy to Railway**

#### **Step 1: Create Railway Account**
Go to https://railway.app/ and sign up

#### **Step 2: New Project from GitHub**
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `muntaseralmuntaser/final-routiex`

#### **Step 3: Add Environment Variables**
In Railway dashboard, add:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `TELEGRAM_BOT_TOKEN`
- `METAAPI_TOKEN`

#### **Step 4: Deploy**
Railway will automatically build and deploy

---

## 🔑 GETTING API CREDENTIALS

### **1. Google OAuth Credentials**

**Steps:**
1. Go to https://console.cloud.google.com/
2. Create new project: "TradePro"
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - For local: `http://localhost:3000/api/auth/google/callback`
   - For production: `https://your-domain.com/api/auth/google/callback`
7. Copy Client ID and Client Secret

### **2. Telegram Bot Token**

**Steps:**
1. Open Telegram
2. Search for @BotFather
3. Send `/newbot`
4. Choose name: "TradePro Bot"
5. Choose username: "your_tradepro_bot"
6. Copy the bot token
7. Set webhook:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook"
```

### **3. MetaAPI Token**

**Steps:**
1. Go to https://metaapi.cloud/
2. Sign up for free account
3. Go to Dashboard
4. Copy API token
5. Add your MT4/MT5 account
6. Get account ID

---

## 📝 CONFIGURATION FILES

### **Files You Need to Update:**

#### **1. wrangler.jsonc**
```jsonc
{
  "name": "your-project-name",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "trading-db-production",
      "database_id": "YOUR_ACTUAL_DATABASE_ID"  // Update this!
    }
  ],
  "kv_namespaces": [
    {
      "binding": "KV",
      "id": "YOUR_KV_ID",  // Update this!
      "preview_id": "YOUR_KV_PREVIEW_ID"  // Update this!
    }
  ]
}
```

#### **2. .dev.vars (Local Development)**
```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
TELEGRAM_BOT_TOKEN=your-bot-token
METAAPI_TOKEN=your-metaapi-token
ENVIRONMENT=development
```

#### **3. Production Secrets (Cloudflare)**
```bash
npx wrangler pages secret put GOOGLE_CLIENT_ID
npx wrangler pages secret put GOOGLE_CLIENT_SECRET
npx wrangler pages secret put TELEGRAM_BOT_TOKEN
npx wrangler pages secret put METAAPI_TOKEN
```

---

## 🔍 TESTING AFTER DEPLOYMENT

### **1. Test Landing Page**
```bash
curl https://your-domain.com
```
Should return HTML with "TradePro" title

### **2. Test API Endpoints**
```bash
# Test auth
curl -I https://your-domain.com/api/auth/google

# Test trading accounts
curl https://your-domain.com/api/trading/accounts

# Test Telegram webhook
curl -X POST https://your-domain.com/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -d '{"message":{"chat":{"id":"123"},"text":"/start"}}'
```

### **3. Test in Browser**
1. Open `https://your-domain.com`
2. Click "Sign In"
3. Click "Continue with Google"
4. Should redirect to Google OAuth
5. After authorization, should go to dashboard

---

## 🔧 TROUBLESHOOTING

### **Problem: Build Fails**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .wrangler
npm install
npm run build
```

### **Problem: Database Not Found**
```bash
# Recreate database
npx wrangler d1 create trading-db-production
# Update wrangler.jsonc with new database_id
npx wrangler d1 migrations apply trading-db-production
```

### **Problem: OAuth Redirect Error**
- Check redirect URI in Google Console matches your domain
- Ensure you added `/api/auth/google/callback` at the end

### **Problem: Telegram Bot Not Responding**
```bash
# Set webhook again
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook"

# Check webhook status
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

### **Problem: Port Already in Use**
```bash
# Kill process on port 3000
fuser -k 3000/tcp

# Or find and kill
lsof -ti:3000 | xargs kill -9
```

---

## 📊 REPOSITORY STRUCTURE

```
final-routiex/
├── src/
│   └── index.tsx              # Backend API
├── public/
│   └── static/
│       └── app.js             # Frontend JavaScript
├── migrations/
│   └── 0001_initial_schema.sql # Database schema
├── dist/                       # Build output (generated)
├── .dev.vars                   # Environment variables (YOU CREATE)
├── .gitignore                  # Git ignore file
├── package.json               # Dependencies
├── wrangler.jsonc             # Cloudflare config
├── ecosystem.config.cjs       # PM2 config
├── seed.sql                   # Empty (no demo data)
├── README.md                  # Documentation
├── SETUP_GUIDE.md             # Setup instructions
├── DEPLOYMENT_SUMMARY.md      # Deployment guide
└── BACKEND_VERIFICATION.md    # Verification report
```

---

## ✅ DEPLOYMENT CHECKLIST

### **Before Deployment:**
- [ ] Clone repository
- [ ] Install Node.js (v18+)
- [ ] Install dependencies (`npm install`)
- [ ] Create `.dev.vars` with credentials
- [ ] Update `wrangler.jsonc` if using Cloudflare
- [ ] Build project (`npm run build`)

### **Cloudflare Pages:**
- [ ] Create Cloudflare account
- [ ] Login with `npx wrangler login`
- [ ] Create D1 database
- [ ] Apply migrations
- [ ] Deploy with `npm run deploy:prod`
- [ ] Set production secrets

### **VPS/Server:**
- [ ] Install Node.js and PM2
- [ ] Clone repository
- [ ] Configure `.dev.vars`
- [ ] Build and start with PM2
- [ ] Configure Nginx (optional)
- [ ] Setup SSL (optional)

### **After Deployment:**
- [ ] Test landing page loads
- [ ] Test login with Google
- [ ] Add MT4/MT5 account
- [ ] Test Telegram bot
- [ ] Test camera feature
- [ ] Test voice commands

---

## 🎯 QUICK START (Any Server)

```bash
# 1. Clone
git clone https://github.com/muntaseralmuntaser/final-routiex.git
cd final-routiex

# 2. Install
npm install

# 3. Configure
cat > .dev.vars << 'EOF'
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
TELEGRAM_BOT_TOKEN=your-token
METAAPI_TOKEN=your-metaapi-token
EOF

# 4. Setup Database (if using Cloudflare)
npx wrangler d1 migrations apply trading-db-production --local

# 5. Build
npm run build

# 6. Run
npx wrangler pages dev dist --d1=trading-db-production --local --ip 0.0.0.0 --port 3000

# Or with PM2
pm2 start ecosystem.config.cjs
```

Open: http://localhost:3000

---

## 📞 SUPPORT COMMANDS

### **Git Operations:**
```bash
# Pull latest changes
git pull origin main

# Check status
git status

# View commits
git log --oneline
```

### **PM2 Operations:**
```bash
# Start
pm2 start ecosystem.config.cjs

# Stop
pm2 stop trading-dashboard

# Restart
pm2 restart trading-dashboard

# Logs
pm2 logs trading-dashboard

# Status
pm2 status
```

### **Database Operations:**
```bash
# Apply migrations (local)
npm run db:migrate:local

# Apply migrations (production)
npm run db:migrate:prod

# Reset database
npm run db:reset
```

---

## 🌐 YOUR GITHUB REPOSITORY

**Repository:** https://github.com/muntaseralmuntaser/final-routiex

**Clone URL:**
```bash
git clone https://github.com/muntaseralmuntaser/final-routiex.git
```

**What's Included:**
- ✅ Complete source code
- ✅ All backend integrations
- ✅ Professional frontend
- ✅ Database migrations
- ✅ Configuration files
- ✅ Documentation
- ✅ PM2 configuration
- ✅ Build scripts

---

## 🎉 SUCCESS!

Your complete trading dashboard system is now on GitHub!

**Next Steps:**
1. ✅ Go to your other server/computer
2. ✅ Clone the repository
3. ✅ Install dependencies
4. ✅ Add your API credentials
5. ✅ Build and deploy
6. ✅ Your system is live!

**No demo data, only LIVE data from real users!**

---

**Repository**: https://github.com/muntaseralmuntaser/final-routiex
**Owner**: muntaseralmuntaser
**Status**: ✅ Pushed Successfully
**Date**: 2026-01-16
