-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  google_id TEXT UNIQUE,
  telegram_id TEXT,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- MT4/MT5 Accounts
CREATE TABLE IF NOT EXISTS trading_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  account_type TEXT NOT NULL, -- 'MT4' or 'MT5'
  account_number TEXT NOT NULL,
  broker TEXT NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  server TEXT,
  balance REAL DEFAULT 0,
  equity REAL DEFAULT 0,
  margin REAL DEFAULT 0,
  free_margin REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  leverage INTEGER DEFAULT 100,
  is_active INTEGER DEFAULT 1,
  last_sync DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Trading History
CREATE TABLE IF NOT EXISTS trades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  ticket TEXT NOT NULL,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL, -- 'BUY' or 'SELL'
  volume REAL NOT NULL,
  open_price REAL NOT NULL,
  close_price REAL,
  open_time DATETIME NOT NULL,
  close_time DATETIME,
  profit REAL DEFAULT 0,
  commission REAL DEFAULT 0,
  swap REAL DEFAULT 0,
  status TEXT DEFAULT 'OPEN', -- 'OPEN', 'CLOSED', 'PENDING'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES trading_accounts(id)
);

-- Telegram Notifications Settings
CREATE TABLE IF NOT EXISTS notification_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  telegram_chat_id TEXT,
  notify_trades INTEGER DEFAULT 1,
  notify_balance INTEGER DEFAULT 1,
  notify_margin_call INTEGER DEFAULT 1,
  notify_daily_summary INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sessions for camera/voice recordings
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_type TEXT NOT NULL, -- 'camera', 'voice', 'screen'
  recording_url TEXT,
  duration INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- API Keys and Secrets (encrypted)
CREATE TABLE IF NOT EXISTS api_credentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  service TEXT NOT NULL, -- 'google', 'telegram', 'mt4', 'mt5', 'metaapi'
  credential_key TEXT NOT NULL,
  credential_value TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_trading_accounts_user_id ON trading_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_account_id ON trades(account_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON notification_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_api_credentials_user_id ON api_credentials(user_id);
