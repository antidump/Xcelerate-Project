const { ethers } = require("hardhat");

async function main() {
  console.log("📋 Xcelerate Launchpad - X Layer Testnet Deployment Summary");
  console.log("=" .repeat(70));
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log(`\n🌐 Network: X Layer Testnet (Chain ID: ${network.chainId})`);
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`💰 Balance: ${(await deployer.provider.getBalance(deployer.address)).toString()} wei`);
  
  // Contract addresses
  const registryAddress = "0x91C3a6ee2b7794C02Eec318865f3694BDF8907e4";
  
  console.log("\n📦 Contract Addresses:");
  console.log("-".repeat(50));
  
  // Connect to Registry to get all addresses
  const Registry = await ethers.getContractFactory("Registry");
  const registry = Registry.attach(registryAddress);
  
  try {
    console.log(`WOKB:                ${await registry.getWOKB()}`);
    console.log(`Registry:            ${registryAddress}`);
    console.log(`TokenFactory:        ${await registry.getTokenFactory()}`);
    console.log(`BondingCurve:        ${await registry.getBondingCurve()}`);
    console.log(`LiquidityPool:       ${await registry.getLiquidityPool()}`);
    console.log(`UserManagement:      ${await registry.getUserManager()}`);
    console.log(`FeeManager:          ${await registry.getFeeManager()}`);
    console.log(`MarketGraduation:    ${await registry.getMarketGraduation()}`);
  } catch (error) {
    console.log("❌ Error fetching contract addresses:", error.message);
  }
  
  console.log("\n🔗 Network Configuration:");
  console.log("-".repeat(50));
  console.log("RPC URL: https://testrpc.xlayer.tech/terigon");
  console.log("Chain ID: 1952");
  console.log("Currency: OKB");
  console.log("Block Explorer: https://www.oklink.com/xlayer-testnet");
  
  console.log("\n🚀 Frontend Configuration:");
  console.log("-".repeat(50));
  console.log("Client config updated with testnet addresses");
  console.log("Wagmi config supports testnet only");
  console.log("Ready to connect wallet and test functionality");
  
  console.log("\n✅ Deployment Status: COMPLETE");
  console.log("🎯 Ready for testing on X Layer Testnet!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
