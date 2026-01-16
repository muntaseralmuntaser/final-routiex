// ============================================
// GLOBAL STATE
// ============================================
let currentUser = null;
let sessionToken = null;
let mediaRecorder = null;
let recordedChunks = [];
let currentStream = null;

// ============================================
// AUTHENTICATION
// ============================================

function loginWithGoogle() {
    window.location.href = '/api/auth/google';
}

async function logout() {
    if (sessionToken) {
        await axios.post('/api/auth/logout', {}, {
            headers: { 'Authorization': `Bearer ${sessionToken}` }
        });
    }
    
    sessionToken = null;
    currentUser = null;
    localStorage.removeItem('sessionToken');
    window.location.reload();
}

async function checkAuth() {
    // Check for token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        sessionToken = token;
        localStorage.setItem('sessionToken', token);
        window.history.replaceState({}, document.title, '/');
    } else {
        sessionToken = localStorage.getItem('sessionToken');
    }

    if (sessionToken) {
        try {
            const response = await axios.get('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${sessionToken}` }
            });
            currentUser = response.data;
            showDashboard();
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('sessionToken');
        }
    }
}

// ============================================
// DASHBOARD UI
// ============================================

function showDashboard() {
    document.getElementById('user-section').innerHTML = `
        <div class="flex items-center gap-4">
            <img src="${currentUser.picture}" alt="${currentUser.name}" class="w-10 h-10 rounded-full">
            <span>${currentUser.name}</span>
            <button onclick="logout()" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                <i class="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
        </div>
    `;

    document.getElementById('main-content').innerHTML = `
        <!-- Dashboard Tabs -->
        <div class="mb-6">
            <div class="flex gap-2 border-b border-gray-700">
                <button onclick="showTab('overview')" class="tab-btn px-6 py-3 font-semibold border-b-2 border-blue-500">
                    <i class="fas fa-home mr-2"></i>Overview
                </button>
                <button onclick="showTab('trading')" class="tab-btn px-6 py-3 font-semibold hover:bg-gray-800">
                    <i class="fas fa-chart-line mr-2"></i>Trading
                </button>
                <button onclick="showTab('telegram')" class="tab-btn px-6 py-3 font-semibold hover:bg-gray-800">
                    <i class="fab fa-telegram mr-2"></i>Telegram
                </button>
                <button onclick="showTab('camera')" class="tab-btn px-6 py-3 font-semibold hover:bg-gray-800">
                    <i class="fas fa-camera mr-2"></i>Camera
                </button>
                <button onclick="showTab('voice')" class="tab-btn px-6 py-3 font-semibold hover:bg-gray-800">
                    <i class="fas fa-microphone mr-2"></i>Voice
                </button>
            </div>
        </div>

        <!-- Tab Content -->
        <div id="tab-content"></div>
    `;

    showTab('overview');
}

function showTab(tabName) {
    // Update active tab styling
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-blue-500');
        btn.classList.add('hover:bg-gray-800');
    });
    event?.target.closest('.tab-btn')?.classList.add('border-blue-500');

    const content = document.getElementById('tab-content');

    switch(tabName) {
        case 'overview':
            content.innerHTML = getOverviewTab();
            loadOverviewData();
            break;
        case 'trading':
            content.innerHTML = getTradingTab();
            loadTradingData();
            break;
        case 'telegram':
            content.innerHTML = getTelegramTab();
            break;
        case 'camera':
            content.innerHTML = getCameraTab();
            break;
        case 'voice':
            content.innerHTML = getVoiceTab();
            break;
    }
}

// ============================================
// OVERVIEW TAB
// ============================================

function getOverviewTab() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Balance Card -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-gray-400">Balance</h3>
                    <i class="fas fa-wallet text-2xl text-blue-500"></i>
                </div>
                <p class="text-3xl font-bold" id="overview-balance">$0.00</p>
                <p class="text-sm text-green-500 mt-2">+0.00%</p>
            </div>

            <!-- Equity Card -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-gray-400">Equity</h3>
                    <i class="fas fa-chart-line text-2xl text-green-500"></i>
                </div>
                <p class="text-3xl font-bold" id="overview-equity">$0.00</p>
                <p class="text-sm text-green-500 mt-2">+0.00%</p>
            </div>

            <!-- Open Trades -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-gray-400">Open Trades</h3>
                    <i class="fas fa-exchange-alt text-2xl text-yellow-500"></i>
                </div>
                <p class="text-3xl font-bold" id="overview-trades">0</p>
            </div>

            <!-- Profit/Loss -->
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-gray-400">Total P/L</h3>
                    <i class="fas fa-dollar-sign text-2xl text-purple-500"></i>
                </div>
                <p class="text-3xl font-bold" id="overview-pl">$0.00</p>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold mb-4">
                <i class="fas fa-history mr-2"></i>Recent Activity
            </h2>
            <div id="recent-activity">
                <p class="text-gray-400">Loading...</p>
            </div>
        </div>
    `;
}

async function loadOverviewData() {
    try {
        const accounts = await axios.get('/api/trading/accounts');
        
        if (accounts.data.length > 0) {
            const account = accounts.data[0];
            document.getElementById('overview-balance').textContent = `$${account.balance.toFixed(2)}`;
            document.getElementById('overview-equity').textContent = `$${account.equity.toFixed(2)}`;
        }

        // Load trades
        if (accounts.data.length > 0) {
            const trades = await axios.get(`/api/trading/trades/${accounts.data[0].id}`);
            const openTrades = trades.data.filter(t => t.status === 'OPEN');
            document.getElementById('overview-trades').textContent = openTrades.length;

            const totalPL = openTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
            document.getElementById('overview-pl').textContent = `$${totalPL.toFixed(2)}`;

            // Show recent trades
            const activityHtml = trades.data.slice(0, 5).map(trade => `
                <div class="flex justify-between items-center py-3 border-b border-gray-700">
                    <div>
                        <p class="font-semibold">${trade.symbol} ${trade.type}</p>
                        <p class="text-sm text-gray-400">${trade.volume} lots @ ${trade.open_price}</p>
                    </div>
                    <div class="text-right">
                        <p class="${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'} font-bold">
                            $${trade.profit?.toFixed(2) || '0.00'}
                        </p>
                        <p class="text-sm text-gray-400">${trade.status}</p>
                    </div>
                </div>
            `).join('');

            document.getElementById('recent-activity').innerHTML = activityHtml || '<p class="text-gray-400">No recent activity</p>';
        }
    } catch (error) {
        console.error('Failed to load overview data:', error);
    }
}

// ============================================
// TRADING TAB
// ============================================

function getTradingTab() {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Accounts List -->
            <div class="lg:col-span-1">
                <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">
                            <i class="fas fa-user-circle mr-2"></i>Accounts
                        </h2>
                        <button onclick="showAddAccountModal()" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                            <i class="fas fa-plus mr-2"></i>Add
                        </button>
                    </div>
                    <div id="accounts-list">
                        <p class="text-gray-400">Loading...</p>
                    </div>
                </div>
            </div>

            <!-- Trades List -->
            <div class="lg:col-span-2">
                <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">
                            <i class="fas fa-list mr-2"></i>Open Trades
                        </h2>
                        <button onclick="syncAccount()" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm">
                            <i class="fas fa-sync mr-2"></i>Sync
                        </button>
                    </div>
                    <div id="trades-list">
                        <p class="text-gray-400">Loading...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Account Modal (hidden) -->
        <div id="add-account-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <h3 class="text-2xl font-bold mb-4">Add Trading Account</h3>
                <form onsubmit="addAccount(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-semibold mb-2">Account Type</label>
                        <select id="account-type" class="w-full bg-gray-700 px-4 py-2 rounded">
                            <option value="MT4">MT4</option>
                            <option value="MT5">MT5</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-semibold mb-2">Account Number</label>
                        <input type="text" id="account-number" class="w-full bg-gray-700 px-4 py-2 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-semibold mb-2">Broker</label>
                        <input type="text" id="broker" class="w-full bg-gray-700 px-4 py-2 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-semibold mb-2">Server</label>
                        <input type="text" id="server" class="w-full bg-gray-700 px-4 py-2 rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-semibold mb-2">API Key (Optional)</label>
                        <input type="text" id="api-key" class="w-full bg-gray-700 px-4 py-2 rounded">
                    </div>
                    <div class="flex gap-4">
                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
                            Add Account
                        </button>
                        <button type="button" onclick="hideAddAccountModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

async function loadTradingData() {
    try {
        const accounts = await axios.get('/api/trading/accounts');
        
        const accountsHtml = accounts.data.map(acc => `
            <div class="bg-gray-700 p-4 rounded mb-3 cursor-pointer hover:bg-gray-600" onclick="selectAccount(${acc.id})">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold">${acc.account_type} - ${acc.account_number}</p>
                        <p class="text-sm text-gray-400">${acc.broker}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-green-500">$${acc.balance.toFixed(2)}</p>
                        <p class="text-xs text-gray-400">${acc.leverage}:1</p>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('accounts-list').innerHTML = accountsHtml || '<p class="text-gray-400">No accounts added</p>';

        // Load trades for first account
        if (accounts.data.length > 0) {
            selectAccount(accounts.data[0].id);
        }
    } catch (error) {
        console.error('Failed to load trading data:', error);
    }
}

async function selectAccount(accountId) {
    try {
        const trades = await axios.get(`/api/trading/trades/${accountId}`);
        const openTrades = trades.data.filter(t => t.status === 'OPEN');

        const tradesHtml = openTrades.map(trade => `
            <div class="bg-gray-700 p-4 rounded mb-3">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold text-lg">${trade.symbol}</p>
                        <p class="text-sm text-gray-400">${trade.type} • ${trade.volume} lots</p>
                        <p class="text-xs text-gray-500">Entry: ${trade.open_price}</p>
                    </div>
                    <div class="text-right">
                        <p class="${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'} font-bold text-xl">
                            $${trade.profit?.toFixed(2) || '0.00'}
                        </p>
                        <p class="text-xs text-gray-400">${new Date(trade.open_time).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('trades-list').innerHTML = tradesHtml || '<p class="text-gray-400">No open trades</p>';
    } catch (error) {
        console.error('Failed to load trades:', error);
    }
}

function showAddAccountModal() {
    document.getElementById('add-account-modal').classList.remove('hidden');
}

function hideAddAccountModal() {
    document.getElementById('add-account-modal').classList.add('hidden');
}

async function addAccount(event) {
    event.preventDefault();
    
    const accountData = {
        userId: currentUser.id || 1,
        accountType: document.getElementById('account-type').value,
        accountNumber: document.getElementById('account-number').value,
        broker: document.getElementById('broker').value,
        server: document.getElementById('server').value,
        apiKey: document.getElementById('api-key').value
    };

    try {
        await axios.post('/api/trading/accounts', accountData);
        hideAddAccountModal();
        loadTradingData();
        alert('Account added successfully!');
    } catch (error) {
        console.error('Failed to add account:', error);
        alert('Failed to add account. Please try again.');
    }
}

async function syncAccount() {
    try {
        const accounts = await axios.get('/api/trading/accounts');
        if (accounts.data.length > 0) {
            await axios.post(`/api/trading/sync/${accounts.data[0].id}`);
            alert('Account synced successfully!');
            loadTradingData();
        }
    } catch (error) {
        console.error('Sync failed:', error);
        alert('Sync failed. Please check your API credentials.');
    }
}

// ============================================
// TELEGRAM TAB
// ============================================

function getTelegramTab() {
    return `
        <div class="max-w-2xl mx-auto">
            <div class="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-2xl font-bold mb-6">
                    <i class="fab fa-telegram text-blue-500 mr-2"></i>
                    Telegram Integration
                </h2>

                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-3">Setup Instructions:</h3>
                    <ol class="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Search for your bot on Telegram</li>
                        <li>Send the <code class="bg-gray-700 px-2 py-1 rounded">/start</code> command</li>
                        <li>Use <code class="bg-gray-700 px-2 py-1 rounded">/balance</code> to check your balance</li>
                        <li>Use <code class="bg-gray-700 px-2 py-1 rounded">/trades</code> to see open trades</li>
                    </ol>
                </div>

                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-3">Notification Settings:</h3>
                    <div class="space-y-3">
                        <label class="flex items-center justify-between p-3 bg-gray-700 rounded">
                            <span>Trade Notifications</span>
                            <input type="checkbox" checked class="w-5 h-5">
                        </label>
                        <label class="flex items-center justify-between p-3 bg-gray-700 rounded">
                            <span>Balance Updates</span>
                            <input type="checkbox" checked class="w-5 h-5">
                        </label>
                        <label class="flex items-center justify-between p-3 bg-gray-700 rounded">
                            <span>Margin Call Alerts</span>
                            <input type="checkbox" checked class="w-5 h-5">
                        </label>
                        <label class="flex items-center justify-between p-3 bg-gray-700 rounded">
                            <span>Daily Summary</span>
                            <input type="checkbox" checked class="w-5 h-5">
                        </label>
                    </div>
                </div>

                <button onclick="testTelegramNotification()" class="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">
                    <i class="fas fa-paper-plane mr-2"></i>
                    Send Test Notification
                </button>
            </div>
        </div>
    `;
}

async function testTelegramNotification() {
    try {
        await axios.post('/api/telegram/notify', {
            userId: currentUser.id || 1,
            message: '🧪 Test notification from Trading Dashboard!\n\n✅ Telegram integration is working correctly.'
        });
        alert('Test notification sent! Check your Telegram.');
    } catch (error) {
        console.error('Failed to send notification:', error);
        alert('Failed to send notification. Please check your Telegram bot configuration.');
    }
}

// ============================================
// CAMERA TAB
// ============================================

function getCameraTab() {
    return `
        <div class="max-w-4xl mx-auto">
            <div class="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-2xl font-bold mb-6">
                    <i class="fas fa-camera text-red-500 mr-2"></i>
                    Camera & Screen Recording
                </h2>

                <!-- Camera Preview -->
                <div class="mb-6">
                    <div class="bg-black rounded-lg overflow-hidden" style="height: 400px;">
                        <video id="camera-preview" autoplay playsinline class="w-full h-full object-cover"></video>
                    </div>
                </div>

                <!-- Controls -->
                <div class="flex gap-4 mb-6">
                    <button onclick="startCamera()" class="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg">
                        <i class="fas fa-video mr-2"></i>Start Camera
                    </button>
                    <button onclick="startScreenRecording()" class="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">
                        <i class="fas fa-desktop mr-2"></i>Share Screen
                    </button>
                    <button onclick="startRecording()" id="record-btn" class="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg" disabled>
                        <i class="fas fa-circle mr-2"></i>Record
                    </button>
                    <button onclick="stopRecording()" id="stop-btn" class="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg" disabled>
                        <i class="fas fa-stop mr-2"></i>Stop
                    </button>
                </div>

                <!-- Recorded Sessions -->
                <div id="camera-sessions">
                    <h3 class="text-xl font-bold mb-4">Recorded Sessions</h3>
                    <div class="space-y-3" id="sessions-list">
                        <p class="text-gray-400">No recordings yet</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function startCamera() {
    try {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        currentStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: true 
        });
        
        document.getElementById('camera-preview').srcObject = currentStream;
        document.getElementById('record-btn').disabled = false;
        alert('Camera started! Click Record to begin recording.');
    } catch (error) {
        console.error('Camera error:', error);
        alert('Failed to access camera. Please grant permissions.');
    }
}

async function startScreenRecording() {
    try {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        currentStream = await navigator.mediaDevices.getDisplayMedia({ 
            video: { width: 1920, height: 1080 }, 
            audio: true 
        });
        
        document.getElementById('camera-preview').srcObject = currentStream;
        document.getElementById('record-btn').disabled = false;
        alert('Screen sharing started! Click Record to begin recording.');
    } catch (error) {
        console.error('Screen share error:', error);
        alert('Failed to share screen.');
    }
}

function startRecording() {
    if (!currentStream) {
        alert('Please start camera or screen sharing first!');
        return;
    }

    recordedChunks = [];
    
    mediaRecorder = new MediaRecorder(currentStream, { 
        mimeType: 'video/webm;codecs=vp9' 
    });

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = saveRecording;

    mediaRecorder.start();
    document.getElementById('record-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    
    // Show recording indicator
    document.getElementById('record-btn').innerHTML = '<i class="fas fa-circle animate-pulse mr-2"></i>Recording...';
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        document.getElementById('record-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('record-btn').innerHTML = '<i class="fas fa-circle mr-2"></i>Record';
    }
}

async function saveRecording() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();

    // Save to database (in production, upload to R2 storage first)
    try {
        await axios.post('/api/sessions', {
            userId: currentUser.id || 1,
            sessionType: 'camera',
            recordingUrl: url,
            duration: 0,
            notes: 'Camera recording'
        });
        
        alert('Recording saved successfully!');
        loadCameraSessions();
    } catch (error) {
        console.error('Failed to save recording:', error);
    }
}

async function loadCameraSessions() {
    try {
        const response = await axios.get(`/api/sessions?userId=${currentUser.id || 1}`);
        const sessions = response.data.filter(s => s.session_type === 'camera');

        const sessionsHtml = sessions.map(session => `
            <div class="bg-gray-700 p-4 rounded">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-semibold">Recording</p>
                        <p class="text-sm text-gray-400">${new Date(session.created_at).toLocaleString()}</p>
                    </div>
                    <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                        <i class="fas fa-download mr-2"></i>Download
                    </button>
                </div>
            </div>
        `).join('');

        document.getElementById('sessions-list').innerHTML = sessionsHtml || '<p class="text-gray-400">No recordings yet</p>';
    } catch (error) {
        console.error('Failed to load sessions:', error);
    }
}

// ============================================
// VOICE TAB
// ============================================

function getVoiceTab() {
    return `
        <div class="max-w-2xl mx-auto">
            <div class="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-2xl font-bold mb-6">
                    <i class="fas fa-microphone text-purple-500 mr-2"></i>
                    Voice Commands & Recording
                </h2>

                <!-- Voice Recognition -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold mb-4">Voice Commands</h3>
                    <div class="bg-gray-700 p-6 rounded-lg mb-4">
                        <p id="voice-output" class="text-xl text-center min-h-12">
                            Click "Start Listening" to begin...
                        </p>
                    </div>
                    <div class="flex gap-4">
                        <button onclick="startVoiceRecognition()" class="flex-1 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg">
                            <i class="fas fa-microphone mr-2"></i>Start Listening
                        </button>
                        <button onclick="stopVoiceRecognition()" class="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg">
                            <i class="fas fa-stop mr-2"></i>Stop
                        </button>
                    </div>
                </div>

                <!-- Available Commands -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold mb-4">Available Commands</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-gray-700 p-3 rounded">
                            <p class="font-semibold">"Show balance"</p>
                            <p class="text-sm text-gray-400">Display account balance</p>
                        </div>
                        <div class="bg-gray-700 p-3 rounded">
                            <p class="font-semibold">"Show trades"</p>
                            <p class="text-sm text-gray-400">List open positions</p>
                        </div>
                        <div class="bg-gray-700 p-3 rounded">
                            <p class="font-semibold">"Sync account"</p>
                            <p class="text-sm text-gray-400">Update trading data</p>
                        </div>
                        <div class="bg-gray-700 p-3 rounded">
                            <p class="font-semibold">"Send notification"</p>
                            <p class="text-sm text-gray-400">Send Telegram message</p>
                        </div>
                    </div>
                </div>

                <!-- Voice Recording -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Voice Notes</h3>
                    <div class="flex gap-4 mb-4">
                        <button onclick="startVoiceRecording()" class="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg">
                            <i class="fas fa-circle mr-2"></i>Record Note
                        </button>
                        <button onclick="stopVoiceRecording()" class="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg" disabled id="stop-voice-btn">
                            <i class="fas fa-stop mr-2"></i>Stop
                        </button>
                    </div>
                    <div id="voice-notes-list" class="space-y-3">
                        <p class="text-gray-400">No voice notes yet</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let recognition = null;

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice recognition is not supported in your browser. Please use Chrome.');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
                processVoiceCommand(transcript.toLowerCase().trim());
            } else {
                interimTranscript += transcript;
            }
        }

        document.getElementById('voice-output').textContent = 
            finalTranscript || interimTranscript || 'Listening...';
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        document.getElementById('voice-output').textContent = 'Error: ' + event.error;
    };

    recognition.start();
    document.getElementById('voice-output').textContent = 'Listening...';
}

function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop();
        document.getElementById('voice-output').textContent = 'Stopped listening';
    }
}

function processVoiceCommand(command) {
    console.log('Voice command:', command);

    if (command.includes('show balance') || command.includes('check balance')) {
        showTab('overview');
        speak('Showing your account balance');
    } else if (command.includes('show trades') || command.includes('open trades')) {
        showTab('trading');
        speak('Showing your open trades');
    } else if (command.includes('sync account') || command.includes('update account')) {
        syncAccount();
        speak('Syncing your trading account');
    } else if (command.includes('send notification') || command.includes('test telegram')) {
        testTelegramNotification();
        speak('Sending test notification');
    } else if (command.includes('hello') || command.includes('hi')) {
        speak('Hello! How can I help you with your trading today?');
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
}

let voiceRecorder = null;
let voiceChunks = [];

async function startVoiceRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        voiceRecorder = new MediaRecorder(stream);
        voiceChunks = [];

        voiceRecorder.ondataavailable = (event) => {
            voiceChunks.push(event.data);
        };

        voiceRecorder.onstop = saveVoiceNote;

        voiceRecorder.start();
        document.getElementById('stop-voice-btn').disabled = false;
    } catch (error) {
        console.error('Microphone error:', error);
        alert('Failed to access microphone');
    }
}

function stopVoiceRecording() {
    if (voiceRecorder && voiceRecorder.state !== 'inactive') {
        voiceRecorder.stop();
        document.getElementById('stop-voice-btn').disabled = true;
        voiceRecorder.stream.getTracks().forEach(track => track.stop());
    }
}

async function saveVoiceNote() {
    const blob = new Blob(voiceChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);

    // Save to database
    try {
        await axios.post('/api/sessions', {
            userId: currentUser.id || 1,
            sessionType: 'voice',
            recordingUrl: url,
            duration: 0,
            notes: 'Voice note'
        });

        alert('Voice note saved!');
        
        // Update UI
        const noteHtml = `
            <div class="bg-gray-700 p-4 rounded flex justify-between items-center">
                <div>
                    <p class="font-semibold">Voice Note</p>
                    <p class="text-sm text-gray-400">${new Date().toLocaleString()}</p>
                </div>
                <audio controls src="${url}" class="h-10"></audio>
            </div>
        `;
        
        document.getElementById('voice-notes-list').innerHTML = noteHtml + 
            document.getElementById('voice-notes-list').innerHTML;
    } catch (error) {
        console.error('Failed to save voice note:', error);
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
