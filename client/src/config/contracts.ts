export const CONTRACTS = {
  WOKB: '0x952E6c15BEA13B9A6077419456B59f46c43F2934',
  REGISTRY: '0xF08511fb706A5a84Ae7738f8a6cA24D5162cc895',
  TOKEN_FACTORY: '0x7689A7ce1d9a09e2B996cCCb6cD81c015D5E36d3',
  BONDING_CURVE: '0xd64fd6b463aC54252FAB669a29d51Ae3373C3467',
  LIQUIDITY_POOL: '0xDC225E7d4e3a1e5A65aC39F4B60E85f7657FFf0C',
  USER_MANAGEMENT: '0x7231bB2Ebc50cB32731cf7303E077B0042ab6778',
  FEE_MANAGER: '0xCaCbd1C17f36061593181B6E482DaB822815c9a5',
  MARKET_GRADUATION: '0x7Df5fda5E528ba80E84C3462cA7D7454c5129c7b',
} as const;

export const CONSTANTS = {
  GRADUATION_THRESHOLD: '80000000000000000000', // 80 OKB
  MAX_SUPPLY_FOR_CURVE: '800000000000000000000000000', // 800M tokens
  DEFAULT_VIRTUAL_OKB: '30000000000000000000', // 30 OKB
  DEFAULT_VIRTUAL_TOKENS: '1073000000000000000000000000', // 1.073B tokens
  CREATION_FEE: '1000000000000000', // 0.001 OKB
} as const;

// ERC20 ABI for token interactions
export const ERC20_ABI = [
  {
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Bonding Curve Contract ABI
export const BONDING_CURVE_ABI = [
  {
    inputs: [
      { name: "tokenAddress", type: "address" },
      { name: "okbAmount", type: "uint256" },
      { name: "minTokens", type: "uint256" }
    ],
    name: "buyTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenAddress", type: "address" },
      { name: "tokenAmount", type: "uint256" },
      { name: "minOkb", type: "uint256" }
    ],
    name: "sellTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "tokenAddress", type: "address" },
      { name: "okbAmount", type: "uint256" },
      { name: "isBuy", type: "bool" }
    ],
    name: "calculateTokens",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Token Factory ABI
export const TOKEN_FACTORY_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "description", type: "string" },
      { name: "imageUrl", type: "string" }
    ],
    name: "createToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;
