
export enum PlatformType {
  MT4 = 'MetaTrader 4',
  MT5 = 'MetaTrader 5',
  CTRADER = 'cTrader',
  TRADINGVIEW = 'TradingView',
  BINANCE = 'Binance'
}

export interface TradingAccount {
  id: string;
  platform: PlatformType;
  accountName: string;
  accountNumber: string;
  balance: number;
  equity: number;
  isConnected: boolean;
}

export interface MarketSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: number;
  tp: number;
  sl: number;
  confidence: number;
  timestamp: string;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED';
}

export interface FeaturedTrader {
    id: string;
    name: string;
    avatar: string;
    winRate: number;
    region: 'ME' | 'EU' | 'ASIA' | 'US';
    followers: number;
    rank: number;
    style: string;
    activeSignal?: {
        symbol: string;
        type: 'BUY' | 'SELL';
        pnl: number;
        image: string;
    };
    isLive: boolean;
}

export interface Channel {
    id: string;
    name: string;
    category: 'VIP' | 'Free' | 'Institutional';
    region: 'Middle East' | 'Europe' | 'East Asia';
    subscribers: number;
    isLive: boolean;
    image: string;
}

export interface TradeHistory {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  closePrice: number;
  pnl: number;
  timestamp: string;
}

export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type LanguageCode = 'en' | 'ar' | 'zh' | 'hi' | 'es';

export interface WatchlistAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export interface PerformanceMetric {
  label: string;
  value: string | number;
  isPositive?: boolean;
  isNeutral?: boolean;
}

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1mo';

export interface ChatMessage {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isAnalyst?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
  color: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'vip' | 'signals' | 'private_group' | 'broadcast';
  activeUsers: number;
  lastMessage?: string;
  unread?: number;
  avatar?: string;
  isVerified?: boolean;
}

export interface IntegrationApp {
    id: string;
    name: string;
    category: 'Trading' | 'Social' | 'Tools' | 'Crypto' | 'AI' | 'Payment' | 'Cloud';
    icon: any;
    connected: boolean;
    description: string;
}

export interface MarketplaceItem {
    id: string;
    title: string;
    category: 'Indicator' | 'Strategy' | 'VPS' | 'Course' | 'Book' | 'Analytics';
    price: number;
    rating: number;
    sales: number;
    author: string;
    description?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    fileType?: 'zip' | 'pdf' | 'ex4' | 'ex5';
    fileUrl?: string;
    sellerId?: string;
    uploadDate?: string;
}

export interface Course {
    id: string;
    title: string;
    level: 'Beginner' | 'Intermediate' | 'Expert';
    duration: string;
    students: number;
    progress?: number;
    image?: string;
    price?: number;
    instructor: string;
    lessons: number;
    isEnrolled?: boolean;
}

export interface Competition {
    id: string;
    title: string;
    prizePool: string;
    participants: number;
    timeLeft: string;
    status: 'LIVE' | 'UPCOMING' | 'ENDED';
    rank?: number;
}

export interface Transaction {
    id: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PURCHASE';
    method: string;
    amount: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    date: string;
    description?: string;
}

export type UserRole = 'admin' | 'user' | 'analyst';
export type UserStatus = 'active' | 'suspended' | 'frozen' | 'banned';

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    plan: 'Free' | 'Starter' | 'Pro' | 'Institutional';
    joinedDate: string;
    lastLogin: string;
    ip: string;
    isSeller: boolean;
    balance: number;
    aiUsageToday: number;
}

export interface AiSignalResponse {
  symbol: string;
  action: 'BUY' | 'SELL';
  confidence: number;
  entryZone: string;
  tp1: string;
  tp2: string;
  tp3: string;
  stopLoss: string;
  reasoning: string;
  timeframe: string;
}

export interface AiHistoryItem {
    id: number;
    timestamp: string;
    symbol: string;
    data: AiSignalResponse;
}

export type TradingStrategy = 'SMC' | 'Scalping' | 'Swing' | 'Elliott Wave' | 'Price Action';

// Virtual Trading
export interface VirtualPosition {
    id: string;
    symbol: string;
    type: 'BUY' | 'SELL';
    lots: number;
    entryPrice: number;
    currentPrice: number;
    pnl: number;
    isOpen: boolean;
}

// Live Studio & Social
export interface GiftItem {
    id: string;
    name: string;
    price: number;
    icon: string;
    animation: string;
}

export interface NewsFeedItem {
    id: string;
    user: string;
    avatar: string;
    videoUrl?: string; // Mock URL or placeholder
    description: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;
}

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
}
