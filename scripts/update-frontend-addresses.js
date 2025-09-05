const fs = require('fs');
const path = require('path');

// Contract addresses from deployment (update these after deployment)
const CONTRACT_ADDRESSES = {
  WOKB: '0x3E9a5039023F464389E539C0411021FB0B5f56F1',
  REGISTRY: '0x91C3a6ee2b7794C02Eec318865f3694BDF8907e4',
  TOKEN_FACTORY: '0x3Dfd5EFc26dcE48f05983Da7c722C1aD06fd3A28',
  BONDING_CURVE: '0x4EbB4a3618F9A77ab3E95805b98F5032624092F7',
  LIQUIDITY_POOL: '0xAc91cB7d96dE0B82A843CB4E29f85dbdFbB7310a',
  USER_MANAGEMENT: '0x139E333c7C1f11249b08D2e7eb2489909202A0CB',
  FEE_MANAGER: '0xEBCe46D21337843DaC60C0bdD056E7C5C0808FB8',
  MARKET_GRADUATION: '0xdcB0DCE877eD07BB8EB449df706B282c7fF2a08e'
};

function updateContractsFile() {
  const contractsPath = path.join(__dirname, '..', 'client', 'src', 'config', 'contracts.ts');
  
  let content = `export const CONTRACTS = {
  // X Layer Testnet Contract Addresses
  WOKB: '${CONTRACT_ADDRESSES.WOKB}',
  REGISTRY: '${CONTRACT_ADDRESSES.REGISTRY}',
  TOKEN_FACTORY: '${CONTRACT_ADDRESSES.TOKEN_FACTORY}',
  BONDING_CURVE: '${CONTRACT_ADDRESSES.BONDING_CURVE}',
  LIQUIDITY_POOL: '${CONTRACT_ADDRESSES.LIQUIDITY_POOL}',
  USER_MANAGEMENT: '${CONTRACT_ADDRESSES.USER_MANAGEMENT}',
  FEE_MANAGER: '${CONTRACT_ADDRESSES.FEE_MANAGER}',
  MARKET_GRADUATION: '${CONTRACT_ADDRESSES.MARKET_GRADUATION}',
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
      { name: "imageUri", type: "string" },
      { name: "description", type: "string" }
    ],
    name: "createToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;
`;

  fs.writeFileSync(contractsPath, content);
  console.log('✅ Updated client/src/config/contracts.ts');
}

function main() {
  console.log('🔄 Updating frontend contract addresses...');
  updateContractsFile();
  console.log('✅ Frontend addresses updated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Restart your dev server: npm run dev');
  console.log('2. Test token creation');
}

main();

