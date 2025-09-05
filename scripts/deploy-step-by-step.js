const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting Step-by-Step Contract Deployment...\n");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "OKB\n");
    
    const contracts = {};
    
    try {
        // Step 1: Deploy WOKB
        console.log("📦 Step 1: Deploying WOKB...");
        const WOKB = await ethers.getContractFactory("WOKB");
        const wokb = await WOKB.deploy();
        await wokb.waitForDeployment();
        contracts.WOKB = await wokb.getAddress();
        console.log("✅ WOKB deployed to:", contracts.WOKB);
        
        // Step 2: Deploy Registry
        console.log("\n📦 Step 2: Deploying Registry...");
        const Registry = await ethers.getContractFactory("Registry");
        const registry = await Registry.deploy();
        await registry.waitForDeployment();
        contracts.Registry = await registry.getAddress();
        console.log("✅ Registry deployed to:", contracts.Registry);
        
        // Step 3: Deploy FeeManager
        console.log("\n📦 Step 3: Deploying FeeManager...");
        const FeeManager = await ethers.getContractFactory("FeeManager");
        const feeManager = await FeeManager.deploy(contracts.Registry, deployer.address); // Using deployer as treasury
        await feeManager.waitForDeployment();
        contracts.FeeManager = await feeManager.getAddress();
        console.log("✅ FeeManager deployed to:", contracts.FeeManager);
        
        // Step 4: Deploy UserManagement
        console.log("\n📦 Step 4: Deploying UserManagement...");
        const UserManagement = await ethers.getContractFactory("UserManagement");
        const userManagement = await UserManagement.deploy(contracts.Registry);
        await userManagement.waitForDeployment();
        contracts.UserManagement = await userManagement.getAddress();
        console.log("✅ UserManagement deployed to:", contracts.UserManagement);
        
        // Step 5: Deploy LiquidityPoolContract
        console.log("\n📦 Step 5: Deploying LiquidityPoolContract...");
        const LiquidityPoolContract = await ethers.getContractFactory("LiquidityPoolContract");
        const liquidityPool = await LiquidityPoolContract.deploy(contracts.Registry);
        await liquidityPool.waitForDeployment();
        contracts.LiquidityPoolContract = await liquidityPool.getAddress();
        console.log("✅ LiquidityPoolContract deployed to:", contracts.LiquidityPoolContract);
        
        // Step 6: Deploy MarketGraduation
        console.log("\n📦 Step 6: Deploying MarketGraduation...");
        const MarketGraduation = await ethers.getContractFactory("MarketGraduation");
        const marketGraduation = await MarketGraduation.deploy(contracts.Registry);
        await marketGraduation.waitForDeployment();
        contracts.MarketGraduation = await marketGraduation.getAddress();
        console.log("✅ MarketGraduation deployed to:", contracts.MarketGraduation);
        
        // Step 7: Deploy BondingCurveContract
        console.log("\n📦 Step 7: Deploying BondingCurveContract...");
        const BondingCurveContract = await ethers.getContractFactory("BondingCurveContract");
        const bondingCurve = await BondingCurveContract.deploy(contracts.Registry);
        await bondingCurve.waitForDeployment();
        contracts.BondingCurveContract = await bondingCurve.getAddress();
        console.log("✅ BondingCurveContract deployed to:", contracts.BondingCurveContract);
        
        // Step 8: Deploy TokenFactory
        console.log("\n📦 Step 8: Deploying TokenFactory...");
        const TokenFactory = await ethers.getContractFactory("TokenFactory");
        const tokenFactory = await TokenFactory.deploy(contracts.Registry);
        await tokenFactory.waitForDeployment();
        contracts.TokenFactory = await tokenFactory.getAddress();
        console.log("✅ TokenFactory deployed to:", contracts.TokenFactory);
        
        // Step 9: Initialize Registry
        console.log("\n🔧 Step 9: Initializing Registry...");
        await registry.initialize(
            contracts.TokenFactory,
            contracts.BondingCurveContract,
            contracts.LiquidityPoolContract,
            contracts.UserManagement,
            contracts.FeeManager,
            contracts.MarketGraduation,
            contracts.WOKB
        );
        console.log("✅ Registry initialized successfully");
        
        // Step 10: Verify deployments
        console.log("\n🔍 Step 10: Verifying deployments...");
        for (const [name, address] of Object.entries(contracts)) {
            const code = await deployer.provider.getCode(address);
            if (code === "0x") {
                console.log("❌", name, "deployment failed - no code at address");
            } else {
                console.log("✅", name, "deployed successfully");
            }
        }
        
        console.log("\n🎉 All contracts deployed successfully!");
        console.log("\n📋 Contract Addresses:");
        console.log("===================");
        for (const [name, address] of Object.entries(contracts)) {
            console.log(`${name}: ${address}`);
        }
        
        // Save to file
        const fs = require('fs');
        const contractData = {
            network: "X Layer Testnet",
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: contracts
        };
        
        fs.writeFileSync('deployment-addresses.json', JSON.stringify(contractData, null, 2));
        console.log("\n💾 Contract addresses saved to deployment-addresses.json");
        
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
