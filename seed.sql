-- Insert demo user (for testing only)
INSERT OR IGNORE INTO users (id, email, name, google_id) VALUES 
  (1, 'demo@example.com', 'Demo User', 'demo_google_id_123');

-- Insert demo trading account
INSERT OR IGNORE INTO trading_accounts (user_id, account_type, account_number, broker, server, balance, equity, margin, free_margin) VALUES 
  (1, 'MT5', '12345678', 'Demo Broker', 'DemoServer-Live', 10000.00, 10000.00, 0.00, 10000.00);

-- Insert demo notification settings
INSERT OR IGNORE INTO notification_settings (user_id, telegram_chat_id, notify_trades, notify_balance) VALUES 
  (1, NULL, 1, 1);
