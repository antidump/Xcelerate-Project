const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 Registering contracts in Registry...");
  
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("Using account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Contract addresses from deployment
  const registryAddress = "0x91C3a6ee2b7794C02Eec318865f3694BDF8907e4";
  const wokbAddress = "0x3E9a5039023F464389E539C0411021FB0B5f56F1";
  const feeManagerAddress = "0xEBCe46D21337843DaC60C0bdD056E7C5C0808FB8";
  const userManagementAddress = "0x139E333c7C1f11249b08D2e7eb2489909202A0CB";
  const bondingCurveAddress = "0x4EbB4a3618F9A77ab3E95805b98F5032624092F7";
  const liquidityPoolAddress = "0xAc91cB7d96dE0B82A843CB4E29f85dbdFbB7310a";
  const marketGraduationAddress = "0xdcB0DCE877eD07BB8EB449df706B282c7fF2a08e";
  const tokenFactoryAddress = "0x3Dfd5EFc26dcE48f05983Da7c722C1aD06fd3A28";

  // Connect to Registry contract
  const Registry = await ethers.getContractFactory("Registry");
  const registry = Registry.attach(registryAddress);

  console.log("\n📝 Registering contracts...");

  try {
    // Initialize Registry with all contract addresses
    console.log("Initializing Registry with all contracts...");
    await registry.initialize(
      tokenFactoryAddress,    // _tokenFactory
      bondingCurveAddress,    // _bondingCurve
      liquidityPoolAddress,   // _liquidityPool
      userManagementAddress,  // _userManager
      feeManagerAddress,      // _feeManager
      marketGraduationAddress, // _marketGraduation
      wokbAddress            // _wokb
    );
    console.log("✅ All contracts registered successfully!");
    
    // Verify registrations
    console.log("\n🔍 Verifying registrations...");
    console.log("TokenFactory:", await registry.getTokenFactory());
    console.log("BondingCurve:", await registry.getBondingCurve());
    console.log("LiquidityPool:", await registry.getLiquidityPool());
    console.log("UserManager:", await registry.getUserManager());
    console.log("FeeManager:", await registry.getFeeManager());
    console.log("MarketGraduation:", await registry.getMarketGraduation());
    console.log("WOKB:", await registry.getWOKB());

  } catch (error) {
    console.error("❌ Error registering contracts:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
