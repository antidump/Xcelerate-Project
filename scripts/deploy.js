const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Xcelerate Launchpad deployment...");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy WOKB first
  console.log("\n📦 Deploying WOKB...");
  const WOKB = await ethers.getContractFactory("WOKB");
  const wokb = await WOKB.deploy();
  await wokb.waitForDeployment();
  const wokbAddress = await wokb.getAddress();
  console.log("WOKB deployed to:", wokbAddress);

  // Deploy Registry
  console.log("\n📦 Deploying Registry...");
  const Registry = await ethers.getContractFactory("Registry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("Registry deployed to:", registryAddress);

  // Deploy FeeManager
  console.log("\n📦 Deploying FeeManager...");
  const FeeManager = await ethers.getContractFactory("FeeManager");
  const feeManager = await FeeManager.deploy(registryAddress, deployer.address); // Use deployer as treasury
  await feeManager.waitForDeployment();
  const feeManagerAddress = await feeManager.getAddress();
  console.log("FeeManager deployed to:", feeManagerAddress);

  // Deploy UserManagement
  console.log("\n📦 Deploying UserManagement...");
  const UserManagement = await ethers.getContractFactory("UserManagement");
  const userManagement = await UserManagement.deploy(registryAddress);
  await userManagement.waitForDeployment();
  const userManagementAddress = await userManagement.getAddress();
  console.log("UserManagement deployed to:", userManagementAddress);

  // Deploy BondingCurveContract
  console.log("\n📦 Deploying BondingCurveContract...");
  const BondingCurveContract = await ethers.getContractFactory("BondingCurveContract");
  const bondingCurve = await BondingCurveContract.deploy(registryAddress);
  await bondingCurve.waitForDeployment();
  const bondingCurveAddress = await bondingCurve.getAddress();
  console.log("BondingCurveContract deployed to:", bondingCurveAddress);

  // Deploy LiquidityPoolContract
  console.log("\n📦 Deploying LiquidityPoolContract...");
  const LiquidityPoolContract = await ethers.getContractFactory("LiquidityPoolContract");
  const liquidityPool = await LiquidityPoolContract.deploy(registryAddress);
  await liquidityPool.waitForDeployment();
  const liquidityPoolAddress = await liquidityPool.getAddress();
  console.log("LiquidityPoolContract deployed to:", liquidityPoolAddress);

  // Deploy MarketGraduation
  console.log("\n📦 Deploying MarketGraduation...");
  const MarketGraduation = await ethers.getContractFactory("MarketGraduation");
  const marketGraduation = await MarketGraduation.deploy(registryAddress);
  await marketGraduation.waitForDeployment();
  const marketGraduationAddress = await marketGraduation.getAddress();
  console.log("MarketGraduation deployed to:", marketGraduationAddress);

  // Deploy TokenFactory
  console.log("\n📦 Deploying TokenFactory...");
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy(
    registryAddress,
    bondingCurveAddress,
    marketGraduationAddress,
    feeManagerAddress
  );
  await tokenFactory.waitForDeployment();
  const tokenFactoryAddress = await tokenFactory.getAddress();
  console.log("TokenFactory deployed to:", tokenFactoryAddress);

  // Register all contracts in Registry
  console.log("\n🔗 Registering contracts in Registry...");
  await registry.setContract("WOKB", wokbAddress);
  await registry.setContract("FeeManager", feeManagerAddress);
  await registry.setContract("UserManagement", userManagementAddress);
  await registry.setContract("BondingCurveContract", bondingCurveAddress);
  await registry.setContract("LiquidityPoolContract", liquidityPoolAddress);
  await registry.setContract("MarketGraduation", marketGraduationAddress);
  await registry.setContract("TokenFactory", tokenFactoryAddress);

  console.log("\n✅ Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("WOKB:", wokbAddress);
  console.log("Registry:", registryAddress);
  console.log("TokenFactory:", tokenFactoryAddress);
  console.log("BondingCurveContract:", bondingCurveAddress);
  console.log("LiquidityPoolContract:", liquidityPoolAddress);
  console.log("UserManagement:", userManagementAddress);
  console.log("FeeManager:", feeManagerAddress);
  console.log("MarketGraduation:", marketGraduationAddress);

  console.log("\n🔍 Verification commands:");
  console.log(`npx hardhat verify --network ${network.name} ${wokbAddress}`);
  console.log(`npx hardhat verify --network ${network.name} ${registryAddress}`);
  console.log(`npx hardhat verify --network ${network.name} ${feeManagerAddress} "${registryAddress}"`);
  console.log(`npx hardhat verify --network ${network.name} ${userManagementAddress} "${registryAddress}"`);
  console.log(`npx hardhat verify --network ${network.name} ${bondingCurveAddress} "${registryAddress}"`);
  console.log(`npx hardhat verify --network ${network.name} ${liquidityPoolAddress} "${registryAddress}" "${wokbAddress}"`);
  console.log(`npx hardhat verify --network ${network.name} ${marketGraduationAddress} "${registryAddress}" "${liquidityPoolAddress}"`);
  console.log(`npx hardhat verify --network ${network.name} ${tokenFactoryAddress} "${registryAddress}" "${bondingCurveAddress}" "${marketGraduationAddress}" "${feeManagerAddress}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
