# 🔴 ROUTIEX ADMIN CONTROL PANEL - USER GUIDE

## 🎯 ADMIN ACCESS CREDENTIALS

**✅ UPDATED ADMIN LOGIN**
- **Email:** `bayanatglobal@gmail.com`
- **Password:** `Dev@#routiex$448890448890`

---

## 🖥️ ADMIN CPANEL FEATURES

### 🔴 RED THEME
- **Fully implemented** red administrative theme throughout the control panel
- **Color Scheme:**
  - Primary: Red (#DC2626)
  - Background: Deep Black (#050000, #0a0000)
  - Accents: Red glow effects with shadows
  - Icons: Red with proper status colors

---

## 👥 USER MONITORING DASHBOARD

### ✅ IMPLEMENTED FEATURES

#### 1. **Real-Time Session Monitoring**
- **Live Status Indicator**: Green pulsing dot for active users, gray for offline
- **Current View Tracking**: Shows which page/section user is currently viewing
  - Dashboard
  - Trading
  - AI Analysis
  - Market Center
  - Offline (when not active)

#### 2. **Mouse & Activity Tracking**
- **Mouse Activity Counter**: Shows mouse movements per minute
- **Live Updates**: Activity metrics refresh in real-time

#### 3. **Camera Status**
- **Camera Icon**: Green when camera is active, gray when disabled
- **Status Display**: Shows "Active" or "Disabled"

#### 4. **Voice/Microphone Monitoring**
- **Mic Icon**: Green when microphone is active, gray when muted
- **Status Display**: Shows "Active" or "Muted"

#### 5. **Chat Message Tracking**
- **Message Counter**: Shows total chat messages sent by user
- **Purple Icon**: Indicates chat activity monitoring

#### 6. **Session Details**
- **IP Address**: Full IP address of user's connection
- **MAC Address**: Network adapter identifier
- **Subscription Tier**: Pro, Institutional, Free, Starter
- **Expiration Date**: Subscription end date

---

## 🎮 ADMIN CONTROL ACTIONS

### Available Controls for Each User:

1. **Live Screen View** 📺
   - Blue monitor icon
   - View user's screen in real-time
   - Click to open live view modal

2. **Chat History** 💬
   - Purple message icon
   - View all chat messages from user
   - Access conversation logs

3. **Terminal Logs** 📄
   - Red file icon
   - View complete activity logs
   - Track all user actions

4. **Suspend/Activate** 🔒
   - Red lock/unlock icon
   - Toggle user account status
   - Active ↔ Suspended

5. **Force Kill** ❌
   - Red X icon
   - Forcefully terminate user session
   - Disconnect immediately

---

## 📊 DASHBOARD STATISTICS

### Main Dashboard Cards:
1. **Live Terminals**: Total active user connections
2. **Subscription Revenue**: Monthly recurring revenue
3. **API Requests (24h)**: Total API calls in last 24 hours
4. **System Security**: Security status (100% = Locked)

### Real-Time Traffic Analysis:
- 30-day visual bar chart
- Hover to see daily metrics
- Auto-updates every 3 seconds

### Recent Admin Actions Log:
- User suspensions
- API key revocations
- Server restarts
- Plan additions

---

## 🖲️ USER MONITORING TABLE

### Columns:
1. **System Identity**: Avatar, Name, Email
2. **Live Session Data**: 
   - Session status (active/offline)
   - Current view
   - Mouse activity
   - Chat messages
   - Camera status
   - Mic status
3. **Subscription**: Plan tier and expiration
4. **Network/IP**: IP address and MAC
5. **Control Panel**: Action buttons

### Search & Filter:
- Real-time search by User ID, IP, or Email
- Instant results filtering
- "Broadcast Global Alert" button for all users

---

## 🌐 SERVER & API MANAGEMENT

### API Gateway Status:
- **Google Gemini Interface**: Operational
- **TradingView Webhook Bridge**: Operational
- **Bloomberg Terminal Pipe**: Maintenance

### System Protocols:
- Force 2FA Global (toggle)
- Maintenance Mode (toggle)
- Deploy System Updates (button)

---

## 🏪 MARKETPLACE CONTROL

- Approve/Reject marketplace items
- Monitor seller activity
- Manage product listings
- View sales statistics

---

## 💰 SUBSCRIPTION & FINANCE

- View subscription analytics
- Track revenue trends
- Manage billing
- Monitor payment status

---

## 📝 GLOBAL LOGS

- System-wide activity logs
- User action tracking
- API request logging
- Error monitoring

---

## 🚀 HOW TO ACCESS

### Step 1: Navigate to Application
Open: https://3000-ix73h38xdrnqpna7crd6t-8f57ffe2.sandbox.novita.ai

### Step 2: Login with Admin Credentials
- Click any "Login" or "Sign In" button
- Enter email: `bayanatglobal@gmail.com`
- Enter password: `Dev@#routiex$448890448890`
- Click "Sign In"

### Step 3: Admin Panel Auto-Loads
- System detects admin credentials
- Automatically redirects to Admin Control Panel
- Red theme interface loads

---

## ⚙️ TECHNICAL IMPLEMENTATION

### Frontend Architecture:
- **Framework**: React 18.2 + TypeScript
- **Styling**: TailwindCSS with custom red theme
- **Icons**: Lucide React
- **State Management**: React hooks

### Data Simulation:
- **Mock Data**: User stats generated with realistic patterns
- **Real-Time Updates**: Simulated with setInterval
- **Random Variations**: Activity metrics change naturally

### Component Location:
- **File**: `/home/user/webapp/components/AdminPanel.tsx`
- **Lines**: 348 lines of code
- **Features**: Full CRUD operations, real-time monitoring

---

## ⚠️ IMPORTANT NOTES

### 1. **Frontend-Only Implementation**
- All monitoring features are **simulated** in the frontend
- No actual backend server tracking real user data
- For production use, requires:
  - WebSocket server for real-time data
  - Database for session logging
  - Analytics service for tracking

### 2. **Security Considerations**
- Admin password is currently in frontend code (not secure)
- For production:
  - Move authentication to backend
  - Use JWT tokens
  - Implement proper session management
  - Add role-based access control (RBAC)

### 3. **Data Persistence**
- All data is stored in React state
- Data resets on page refresh
- For production:
  - Implement PostgreSQL or MongoDB database
  - Add Redis for session management
  - Set up proper data persistence

---

## 📋 FEATURES ROADMAP

### Phase 1: ✅ COMPLETED
- [x] Red administrative theme
- [x] Admin credentials update
- [x] User monitoring dashboard
- [x] Session tracking UI
- [x] Camera/Mic status display
- [x] Mouse activity counter
- [x] Chat message tracking
- [x] Control action buttons

### Phase 2: ⏳ PENDING (Backend Required)
- [ ] Real WebSocket connection for live data
- [ ] Actual screen sharing implementation
- [ ] Real camera/mic access (requires permissions)
- [ ] Database integration for logs
- [ ] Real IP geolocation
- [ ] Session recording playback

### Phase 3: ⏳ PENDING (Advanced Features)
- [ ] Machine learning anomaly detection
- [ ] Automated threat response
- [ ] Multi-admin support with permissions
- [ ] Export reports to PDF
- [ ] Email alerts for suspicious activity

---

## 🎯 CURRENT STATUS

| Feature | Status | Implementation |
|---------|--------|----------------|
| Red Admin Theme | ✅ Complete | 100% |
| Admin Login | ✅ Complete | 100% |
| User List Display | ✅ Complete | 100% |
| Session Status | ✅ Simulated | 100% UI |
| Mouse Tracking | ✅ Simulated | 100% UI |
| Camera Status | ✅ Simulated | 100% UI |
| Mic Status | ✅ Simulated | 100% UI |
| Chat Tracking | ✅ Simulated | 100% UI |
| IP Display | ✅ Simulated | 100% UI |
| Control Buttons | ✅ Complete | 100% UI |
| Real-Time Data | ⚠️ Simulated | Backend Needed |
| Screen Sharing | ⚠️ Placeholder | Backend Needed |
| Database Logs | ❌ Missing | Backend Needed |

---

## 📞 SUPPORT & DEVELOPMENT

For real backend implementation with actual monitoring capabilities, you'll need:

1. **Backend Server**: Node.js/Express or Hono
2. **Database**: PostgreSQL or MongoDB
3. **Real-Time**: Socket.io for WebSockets
4. **Analytics**: Google Analytics or Mixpanel
5. **Session Management**: Redis
6. **Monitoring**: Sentry for error tracking

---

**Version:** 4.5.0  
**Last Updated:** 2026-01-16  
**Admin Panel Status:** ✅ Fully Operational (Frontend)
