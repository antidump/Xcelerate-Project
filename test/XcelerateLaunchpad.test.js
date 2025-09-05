const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Xcelerate Launchpad", function () {
  let owner, user1, user2;
  let wokb, registry, feeManager, userManagement, bondingCurve, liquidityPool, marketGraduation, tokenFactory;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy WOKB
    const WOKB = await ethers.getContractFactory("WOKB");
    wokb = await WOKB.deploy();
    await wokb.waitForDeployment();

    // Deploy Registry
    const Registry = await ethers.getContractFactory("Registry");
    registry = await Registry.deploy();
    await registry.waitForDeployment();

    // Deploy FeeManager
    const FeeManager = await ethers.getContractFactory("FeeManager");
    feeManager = await FeeManager.deploy(await registry.getAddress());
    await feeManager.waitForDeployment();

    // Deploy UserManagement
    const UserManagement = await ethers.getContractFactory("UserManagement");
    userManagement = await UserManagement.deploy(await registry.getAddress());
    await userManagement.waitForDeployment();

    // Deploy BondingCurveContract
    const BondingCurveContract = await ethers.getContractFactory("BondingCurveContract");
    bondingCurve = await BondingCurveContract.deploy(await registry.getAddress());
    await bondingCurve.waitForDeployment();

    // Deploy LiquidityPoolContract
    const LiquidityPoolContract = await ethers.getContractFactory("LiquidityPoolContract");
    liquidityPool = await LiquidityPoolContract.deploy(await registry.getAddress(), await wokb.getAddress());
    await liquidityPool.waitForDeployment();

    // Deploy MarketGraduation
    const MarketGraduation = await ethers.getContractFactory("MarketGraduation");
    marketGraduation = await MarketGraduation.deploy(await registry.getAddress(), await liquidityPool.getAddress());
    await marketGraduation.waitForDeployment();

    // Deploy TokenFactory
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    tokenFactory = await TokenFactory.deploy(
      await registry.getAddress(),
      await bondingCurve.getAddress(),
      await marketGraduation.getAddress(),
      await feeManager.getAddress()
    );
    await tokenFactory.waitForDeployment();

    // Register contracts in Registry
    await registry.setContract("WOKB", await wokb.getAddress());
    await registry.setContract("FeeManager", await feeManager.getAddress());
    await registry.setContract("UserManagement", await userManagement.getAddress());
    await registry.setContract("BondingCurveContract", await bondingCurve.getAddress());
    await registry.setContract("LiquidityPoolContract", await liquidityPool.getAddress());
    await registry.setContract("MarketGraduation", await marketGraduation.getAddress());
    await registry.setContract("TokenFactory", await tokenFactory.getAddress());
  });

  describe("WOKB", function () {
    it("Should have correct name and symbol", async function () {
      expect(await wokb.name()).to.equal("Wrapped OKB");
      expect(await wokb.symbol()).to.equal("WOKB");
      expect(await wokb.decimals()).to.equal(18);
    });

    it("Should allow minting and burning", async function () {
      const amount = ethers.parseEther("100");
      
      await wokb.mint(user1.address, amount);
      expect(await wokb.balanceOf(user1.address)).to.equal(amount);
      
      await wokb.connect(user1).burn(amount);
      expect(await wokb.balanceOf(user1.address)).to.equal(0);
    });
  });

  describe("Registry", function () {
    it("Should allow owner to set contracts", async function () {
      await registry.setContract("TestContract", user1.address);
      expect(await registry.getContract("TestContract")).to.equal(user1.address);
    });

    it("Should not allow non-owner to set contracts", async function () {
      await expect(
        registry.connect(user1).setContract("TestContract", user2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("TokenFactory", function () {
    it("Should create a new token", async function () {
      const name = "Test Token";
      const symbol = "TEST";
      const description = "A test token";
      const imageUrl = "https://example.com/image.png";

      const tx = await tokenFactory.createToken(name, symbol, description, imageUrl, {
        value: ethers.parseEther("0.001") // Creation fee
      });

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = tokenFactory.interface.parseLog(log);
          return parsed.name === "TokenCreated";
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
    });

    it("Should require creation fee", async function () {
      const name = "Test Token";
      const symbol = "TEST";
      const description = "A test token";
      const imageUrl = "https://example.com/image.png";

      await expect(
        tokenFactory.createToken(name, symbol, description, imageUrl)
      ).to.be.revertedWith("Insufficient creation fee");
    });
  });

  describe("BondingCurveContract", function () {
    it("Should initialize token curve correctly", async function () {
      const tokenAddress = await createTestToken();
      
      const curve = await bondingCurve.tokenCurves(tokenAddress);
      expect(curve.virtualOkbReserves).to.equal(ethers.parseEther("30"));
      expect(curve.virtualTokenReserves).to.equal(ethers.parseEther("1073000000"));
      expect(curve.active).to.be.true;
    });

    it("Should calculate buy price correctly", async function () {
      const tokenAddress = await createTestToken();
      const okbAmount = ethers.parseEther("1");
      
      const tokensOut = await bondingCurve.calculateTokens(tokenAddress, okbAmount, true);
      expect(tokensOut).to.be.gt(0);
    });

    it("Should allow buying tokens", async function () {
      const tokenAddress = await createTestToken();
      const okbAmount = ethers.parseEther("1");
      const minTokens = ethers.parseEther("1000");
      
      await expect(
        bondingCurve.buyTokens(tokenAddress, minTokens, { value: okbAmount })
      ).to.not.be.reverted;
    });
  });

  async function createTestToken() {
    const name = "Test Token";
    const symbol = "TEST";
    const description = "A test token";
    const imageUrl = "https://example.com/image.png";

    const tx = await tokenFactory.createToken(name, symbol, description, imageUrl, {
      value: ethers.parseEther("0.001")
    });

    const receipt = await tx.wait();
    const event = receipt.logs.find(log => {
      try {
        const parsed = tokenFactory.interface.parseLog(log);
        return parsed.name === "TokenCreated";
      } catch {
        return false;
      }
    });

    return event.args.tokenAddress;
  }
});
