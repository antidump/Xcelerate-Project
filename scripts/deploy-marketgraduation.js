const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying MarketGraduation only...");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Use existing Registry address from previous deployment
  const registryAddress = "0x91C3a6ee2b7794C02Eec318865f3694BDF8907e4";
  
  // Deploy MarketGraduation
  console.log("\n📦 Deploying MarketGraduation...");
  const MarketGraduation = await ethers.getContractFactory("MarketGraduation");
  const marketGraduation = await MarketGraduation.deploy(registryAddress);
  await marketGraduation.waitForDeployment();
  const marketGraduationAddress = await marketGraduation.getAddress();
  console.log("MarketGraduation deployed to:", marketGraduationAddress);

  console.log("\n✅ MarketGraduation deployment completed!");
  console.log("Address:", marketGraduationAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
