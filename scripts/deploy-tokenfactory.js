const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying TokenFactory only...");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Use existing contract addresses from previous deployment
  const registryAddress = "0x91C3a6ee2b7794C02Eec318865f3694BDF8907e4";
  const bondingCurveAddress = "0x4EbB4a3618F9A77ab3E95805b98F5032624092F7";
  const marketGraduationAddress = "0xdcB0DCE877eD07BB8EB449df706B282c7fF2a08e";
  const feeManagerAddress = "0xEBCe46D21337843DaC60C0bdD056E7C5C0808FB8";
  
  // Deploy TokenFactory
  console.log("\n📦 Deploying TokenFactory...");
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy(registryAddress);
  await tokenFactory.waitForDeployment();
  const tokenFactoryAddress = await tokenFactory.getAddress();
  console.log("TokenFactory deployed to:", tokenFactoryAddress);

  console.log("\n✅ TokenFactory deployment completed!");
  console.log("Address:", tokenFactoryAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
