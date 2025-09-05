const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Complete Xcelerate Launchpad deployment...");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "OKB");
  console.log("Network:", network.name, "Chain ID:", network.chainId);

  const deployedContracts = {};

  try {
    // 1. Deploy WOKB first
    console.log("\n📦 Deploying WOKB...");
    const WOKB = await ethers.getContractFactory("WOKB");
    const wokb = await WOKB.deploy();
    await wokb.waitForDeployment();
    const wokbAddress = await wokb.getAddress();
    deployedContracts.WOKB = wokbAddress;
    console.log("✅ WOKB deployed to:", wokbAddress);

    // 2. Deploy Registry
    console.log("\n📦 Deploying Registry...");
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    deployedContracts.REGISTRY = registryAddress;
    console.log("✅ Registry deployed to:", registryAddress);

    // 3. Deploy FeeManager
    console.log("\n📦 Deploying FeeManager...");
    const FeeManager = await ethers.getContractFactory("FeeManager");
    const feeManager = await FeeManager.deploy(registryAddress, deployer.address);
    await feeManager.waitForDeployment();
    const feeManagerAddress = await feeManager.getAddress();
    deployedContracts.FEE_MANAGER = feeManagerAddress;
    console.log("✅ FeeManager deployed to:", feeManagerAddress);

    // 4. Deploy BondingCurveContract
    console.log("\n📦 Deploying BondingCurveContract...");
    const BondingCurveContract = await ethers.getContractFactory("BondingCurveContract");
    const bondingCurve = await BondingCurveContract.deploy(registryAddress);
    await bondingCurve.waitForDeployment();
    const bondingCurveAddress = await bondingCurve.getAddress();
    deployedContracts.BONDING_CURVE = bondingCurveAddress;
    console.log("✅ BondingCurveContract deployed to:", bondingCurveAddress);

    // 5. Deploy LiquidityPoolContract
    console.log("\n📦 Deploying LiquidityPoolContract...");
    const LiquidityPoolContract = await ethers.getContractFactory("LiquidityPoolContract");
    const liquidityPool = await LiquidityPoolContract.deploy(registryAddress);
    await liquidityPool.waitForDeployment();
    const liquidityPoolAddress = await liquidityPool.getAddress();
    deployedContracts.LIQUIDITY_POOL = liquidityPoolAddress;
    console.log("✅ LiquidityPoolContract deployed to:", liquidityPoolAddress);

    // 6. Deploy UserManagement
    console.log("\n📦 Deploying UserManagement...");
    const UserManagement = await ethers.getContractFactory("UserManagement");
    const userManagement = await UserManagement.deploy(registryAddress);
    await userManagement.waitForDeployment();
    const userManagementAddress = await userManagement.getAddress();
    deployedContracts.USER_MANAGEMENT = userManagementAddress;
    console.log("✅ UserManagement deployed to:", userManagementAddress);

    // 7. Deploy MarketGraduation
    console.log("\n📦 Deploying MarketGraduation...");
    const MarketGraduation = await ethers.getContractFactory("MarketGraduation");
    const marketGraduation = await MarketGraduation.deploy(registryAddress);
    await marketGraduation.waitForDeployment();
    const marketGraduationAddress = await marketGraduation.getAddress();
    deployedContracts.MARKET_GRADUATION = marketGraduationAddress;
    console.log("✅ MarketGraduation deployed to:", marketGraduationAddress);

    // 8. Deploy TokenFactory (last, as it needs all other contracts)
    console.log("\n📦 Deploying TokenFactory...");
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    const tokenFactory = await TokenFactory.deploy(registryAddress);
    await tokenFactory.waitForDeployment();
    const tokenFactoryAddress = await tokenFactory.getAddress();
    deployedContracts.TOKEN_FACTORY = tokenFactoryAddress;
    console.log("✅ TokenFactory deployed to:", tokenFactoryAddress);

    // 9. Initialize Registry with all contract addresses
    console.log("\n🔧 Initializing Registry...");
    const registryContract = await ethers.getContractAt("Registry", registryAddress);
    const initTx = await registryContract.initialize(
      tokenFactoryAddress,
      bondingCurveAddress,
      liquidityPoolAddress,
      userManagementAddress,
      feeManagerAddress,
      marketGraduationAddress,
      wokbAddress
    );
    await initTx.wait();
    console.log("✅ Registry initialized successfully");

    // 10. Verify all contracts are properly set
    console.log("\n🔍 Verifying contract addresses in Registry...");
    console.log("TokenFactory:", await registryContract.getTokenFactory());
    console.log("BondingCurve:", await registryContract.getBondingCurve());
    console.log("LiquidityPool:", await registryContract.getLiquidityPool());
    console.log("UserManagement:", await registryContract.getUserManager());
    console.log("FeeManager:", await registryContract.getFeeManager());
    console.log("MarketGraduation:", await registryContract.getMarketGraduation());
    console.log("WOKB:", await registryContract.getWOKB());

    // 11. Save deployment summary
    console.log("\n📋 Deployment Summary:");
    console.log("=" .repeat(50));
    for (const [name, address] of Object.entries(deployedContracts)) {
      console.log(`${name}: ${address}`);
    }
    console.log("=" .repeat(50));

    // 12. Generate .env file content
    console.log("\n📝 Add these addresses to your .env file:");
    console.log("=" .repeat(50));
    for (const [name, address] of Object.entries(deployedContracts)) {
      console.log(`${name}=${address}`);
    }
    console.log("=" .repeat(50));

    console.log("\n🎉 All contracts deployed and initialized successfully!");
    console.log("Ready to create tokens! 🚀");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

