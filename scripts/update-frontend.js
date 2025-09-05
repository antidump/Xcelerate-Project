const fs = require('fs');

// Read deployment addresses
const deploymentData = JSON.parse(fs.readFileSync('deployment-addresses.json', 'utf8'));
const contracts = deploymentData.contracts;

// Update frontend contracts.ts
const contractsTsContent = `// Auto-generated contract addresses
// Generated at: ${deploymentData.timestamp}
// Network: ${deploymentData.network}
// Deployer: ${deploymentData.deployer}

export const CONTRACTS = {
  TOKEN_FACTORY: "${contracts.TokenFactory}",
  BONDING_CURVE: "${contracts.BondingCurveContract}",
  REGISTRY: "${contracts.Registry}",
  FEE_MANAGER: "${contracts.FeeManager}",
  USER_MANAGEMENT: "${contracts.UserManagement}",
  LIQUIDITY_POOL: "${contracts.LiquidityPoolContract}",
  MARKET_GRADUATION: "${contracts.MarketGraduation}",
  WOKB: "${contracts.WOKB}",
} as const;

export const CONSTANTS = {
  CREATION_FEE: "1000000000000000", // 0.001 OKB in wei
  GRADUATION_THRESHOLD: "80000000000000000000", // 80 OKB in wei
  MAX_SUPPLY: "1000000000000000000000000000", // 1B tokens in wei
} as const;
`;

fs.writeFileSync('client/src/config/contracts.ts', contractsTsContent);
console.log("✅ Frontend contracts.ts updated successfully!");

// Also create a simple JSON file for easy reference
const simpleAddresses = {
  TokenFactory: contracts.TokenFactory,
  BondingCurve: contracts.BondingCurveContract,
  Registry: contracts.Registry,
  FeeManager: contracts.FeeManager,
  UserManagement: contracts.UserManagement,
  LiquidityPool: contracts.LiquidityPoolContract,
  MarketGraduation: contracts.MarketGraduation,
  WOKB: contracts.WOKB
};

fs.writeFileSync('contract-addresses.json', JSON.stringify(simpleAddresses, null, 2));
console.log("✅ Contract addresses saved to contract-addresses.json");

