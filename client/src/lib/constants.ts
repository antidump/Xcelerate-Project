import { parseEther } from 'viem';

// Network constants
export const NETWORK_CONFIG = {
  CHAIN_ID: 1952,
  NAME: 'X Layer Testnet',
  RPC_URL: 'https://testrpc.xlayer.tech/terigon',
  EXPLORER_URL: 'https://www.oklink.com/xlayer-testnet',
  NATIVE_CURRENCY: {
    name: 'OKB',
    symbol: 'OKB',
    decimals: 18,
  },
} as const;

// Contract constants
export const BONDING_CURVE_CONSTANTS = {
  GRADUATION_THRESHOLD: parseEther('80'), // 80 OKB
  MAX_SUPPLY_FOR_CURVE: parseEther('800000000'), // 800M tokens
  DEFAULT_VIRTUAL_OKB: parseEther('30'), // 30 OKB
  DEFAULT_VIRTUAL_TOKENS: parseEther('1073000000'), // 1.073B tokens
  CREATION_FEE: parseEther('0.001'), // 0.001 OKB
} as const;

// Fee distribution percentages
export const FEE_DISTRIBUTION = {
  PLATFORM: 2.0, // 2%
  CREATOR: 1.0, // 1%
  STAKERS: 1.0, // 1%
  LIQUIDITY_PROVIDERS: 0.5, // 0.5%
  REFERRERS: 0.5, // 0.5%
} as const;

// Trading constants
export const TRADING_CONSTANTS = {
  DEFAULT_SLIPPAGE: 2.0, // 2%
  MAX_SLIPPAGE: 10.0, // 10%
  MIN_SLIPPAGE: 0.1, // 0.1%
  SLIPPAGE_STEP: 0.1,
  MIN_TRADE_AMOUNT: parseEther('0.0001'), // 0.0001 OKB
  MAX_TRADE_AMOUNT: parseEther('1000'), // 1000 OKB
} as const;

// UI constants
export const UI_CONSTANTS = {
  REFRESH_INTERVALS: {
    STATS: 30000, // 30 seconds
    TOKENS: 10000, // 10 seconds
    PORTFOLIO: 15000, // 15 seconds
    TRADES: 5000, // 5 seconds
  },
  PAGINATION: {
    TOKENS_PER_PAGE: 20,
    TRADES_PER_PAGE: 50,
    LEADERBOARD_SIZE: 10,
  },
  FORMATTING: {
    DECIMAL_PLACES: {
      PRICE: 6,
      AMOUNT: 4,
      PERCENTAGE: 2,
    },
    LARGE_NUMBER_THRESHOLD: 1000,
  },
} as const;

// Token validation constants
export const TOKEN_VALIDATION = {
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  SYMBOL: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 10,
    PATTERN: /^[A-Z0-9]+$/,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'],
  },
} as const;

// Analytics constants
export const ANALYTICS_CONSTANTS = {
  TIME_PERIODS: {
    '1D': 1,
    '7D': 7,
    '30D': 30,
    '90D': 90,
    '1Y': 365,
  },
  CHART_POINTS: {
    '1D': 24, // Hourly data
    '7D': 7, // Daily data
    '30D': 30, // Daily data
    '90D': 90, // Daily data
    '1Y': 12, // Monthly data
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET: {
    NOT_CONNECTED: 'Please connect your wallet to continue',
    WRONG_NETWORK: 'Please switch to X Layer Testnet network',
    INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
    TRANSACTION_REJECTED: 'Transaction was rejected by user',
  },
  TRADING: {
    INVALID_AMOUNT: 'Please enter a valid amount',
    AMOUNT_TOO_LOW: 'Amount is below minimum trade size',
    AMOUNT_TOO_HIGH: 'Amount exceeds maximum trade size',
    SLIPPAGE_TOO_HIGH: 'Slippage tolerance is too high',
    PRICE_IMPACT_HIGH: 'Price impact is very high, consider reducing trade size',
  },
  TOKEN_CREATION: {
    INVALID_NAME: 'Token name is required and must be under 50 characters',
    INVALID_SYMBOL: 'Token symbol must be 1-10 uppercase alphanumeric characters',
    DESCRIPTION_TOO_LONG: 'Description must be under 500 characters',
    IMAGE_TOO_LARGE: 'Image file must be under 10MB',
    INVALID_IMAGE_TYPE: 'Please upload a PNG, JPG, or GIF image',
    CREATION_FAILED: 'Failed to create token. Please try again.',
  },
  GENERAL: {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  TOKEN_CREATED: 'Token created successfully! It\'s now live on the bonding curve.',
  TRADE_SUCCESSFUL: 'Trade executed successfully!',
  WALLET_CONNECTED: 'Wallet connected successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  SLIPPAGE_TOLERANCE: 'xcelerate_slippage_tolerance',
  THEME: 'xcelerate_theme',
  DISMISSED_WARNINGS: 'xcelerate_dismissed_warnings',
  RECENT_TOKENS: 'xcelerate_recent_tokens',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  DOCUMENTATION: 'https://docs.xcelerate.io',
  GITHUB: 'https://github.com/xcelerate-platform',
  TWITTER: 'https://twitter.com/xceleratexlayer',
  DISCORD: 'https://discord.gg/xcelerate',
  TELEGRAM: 'https://t.me/xcelerate',
  OKLINK_EXPLORER: 'https://www.oklink.com/xlayer-testnet',
} as const;

// Theme constants
export const THEME_CONFIG = {
  GLASSMORPHISM: {
    BACKDROP_BLUR: 'blur(20px)',
    BACKGROUND_OPACITY: 0.05,
    BORDER_OPACITY: 0.1,
    SHADOW: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
    HERO: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
    BUTTON: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  },
  ANIMATIONS: {
    DURATION: {
      FAST: '0.2s',
      NORMAL: '0.3s',
      SLOW: '0.5s',
    },
    EASING: {
      EASE_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.6, 1)',
      BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  TOKENS: '/api/tokens',
  USERS: '/api/users',
  TRADES: '/api/trades',
  PORTFOLIO: '/api/portfolio',
  STATS: '/api/stats',
  BONDING_CURVE: '/api/bonding-curve',
} as const;

// WebSocket events (for future real-time features)
export const WS_EVENTS = {
  PRICE_UPDATE: 'price_update',
  NEW_TRADE: 'new_trade',
  TOKEN_GRADUATED: 'token_graduated',
  NEW_TOKEN: 'new_token',
} as const;

// Utility functions for constants
export function getFormattedNetworkName(): string {
  return `${NETWORK_CONFIG.NAME} (${NETWORK_CONFIG.CHAIN_ID})`;
}

export function getExplorerUrl(type: 'tx' | 'address' | 'token', hash: string): string {
  const baseUrl = NETWORK_CONFIG.EXPLORER_URL;
  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${hash}`;
    case 'address':
      return `${baseUrl}/address/${hash}`;
    case 'token':
      return `${baseUrl}/token/${hash}`;
    default:
      return baseUrl;
  }
}

export function formatSlippage(slippage: number): string {
  return `${slippage.toFixed(1)}%`;
}

export function isValidSlippage(slippage: number): boolean {
  return slippage >= TRADING_CONSTANTS.MIN_SLIPPAGE && slippage <= TRADING_CONSTANTS.MAX_SLIPPAGE;
}

export function getRefreshInterval(type: keyof typeof UI_CONSTANTS.REFRESH_INTERVALS): number {
  return UI_CONSTANTS.REFRESH_INTERVALS[type];
}
