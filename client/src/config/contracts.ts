// Auto-generated contract addresses
// Generated at: 2025-09-05T08:03:05.968Z
// Network: X Layer Testnet
// Deployer: 0xCd8235F71d6694241EEfa360faC722c4b762d053

export const CONTRACTS = {
  TOKEN_FACTORY: "0xfB5ACFc398AE85cF3A2CFFc9dB6B1E8b42f3A701",
  BONDING_CURVE: "0x08Ddf630e7Cd6FCEa435588a80028AF2b75FfFD7",
  REGISTRY: "0x4C7943d2bb06a40A0e8B36ba846feEfd6A3ff010",
  FEE_MANAGER: "0x97974a70ddbC578E81143DB1e635FbA3aa80931A",
  USER_MANAGEMENT: "0x4a9Cab7d650b481F7a44dCa4C3B893baF4Ae7e30",
  LIQUIDITY_POOL: "0xC4F4fBe190c446fE2f9cd020FEeb4DAD3224b43E",
  MARKET_GRADUATION: "0xb5F38c9BC288c585a63ab18ea5e425bDA2755391",
  WOKB: "0x298559c632cA6771eaF20ce24cac4fec24f10948",
} as const;

export const CONSTANTS = {
  CREATION_FEE: "1000000000000000", // 0.001 OKB in wei
  GRADUATION_THRESHOLD: "80000000000000000000", // 80 OKB in wei
  MAX_SUPPLY: "1000000000000000000000000000", // 1B tokens in wei
} as const;

// ERC20 ABI (minimal)
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
] as const;

// TokenFactory ABI
export const TOKEN_FACTORY_ABI = [
  {
    "type": "function",
    "name": "createToken",
    "inputs": [
      {"name": "name", "type": "string"},
      {"name": "symbol", "type": "string"},
      {"name": "imageUri", "type": "string"},
      {"name": "description", "type": "string"}
    ],
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getTokenCount",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllTokens",
    "inputs": [],
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCreatorTokens",
    "inputs": [{"name": "creator", "type": "address"}],
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "TokenCreated",
    "inputs": [
      {"name": "tokenAddress", "type": "address", "indexed": true},
      {"name": "creator", "type": "address", "indexed": true},
      {"name": "name", "type": "string", "indexed": false},
      {"name": "symbol", "type": "string", "indexed": false},
      {"name": "totalSupply", "type": "uint256", "indexed": false}
    ]
  }
] as const;

// BondingCurve ABI
export const BONDING_CURVE_ABI = [
  "function buyTokens(address token, uint256 okbAmount) external payable returns (uint256)",
  "function sellTokens(address token, uint256 tokenAmount) external returns (uint256)",
  "function getPrice(address token, uint256 amount) external view returns (uint256)",
  "function initializeCurve(address token) external",
  "function getCurveInfo(address token) external view returns (tuple(uint256 soldSupply, uint256 okbCollected, uint256 virtualOkbReserves, uint256 virtualTokenReserves, bool graduated, bool active))",
  "function getTokenBalance(address token) external view returns (uint256)",
  "event TokenBought(address indexed token, address indexed buyer, uint256 okbIn, uint256 tokensOut, uint256 newPrice)",
  "event TokenSold(address indexed token, address indexed seller, uint256 tokensIn, uint256 okbOut, uint256 newPrice)"
] as const;
