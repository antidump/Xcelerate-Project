import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTokenSchema, insertTradeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByWallet(userData.walletAddress);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.get("/api/users/:walletAddress", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  // Token routes
  app.get("/api/tokens", async (req, res) => {
    try {
      const { graduated } = req.query;
      const filter = graduated !== undefined ? { isGraduated: graduated === 'true' } : undefined;
      const tokens = await storage.getAllTokens(filter);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tokens", error });
    }
  });

  app.get("/api/tokens/:id", async (req, res) => {
    try {
      const token = await storage.getToken(req.params.id);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
      res.json(token);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch token", error });
    }
  });

  app.post("/api/tokens", async (req, res) => {
    try {
      const tokenData = insertTokenSchema.parse(req.body);
      const { creatorWallet, contractAddress } = req.body;
      
      if (!creatorWallet || !contractAddress) {
        return res.status(400).json({ message: "Creator wallet and contract address required" });
      }
      
      // Get or create user
      let user = await storage.getUserByWallet(creatorWallet);
      if (!user) {
        user = await storage.createUser({ walletAddress: creatorWallet });
      }
      
      const token = await storage.createToken({
        ...tokenData,
        creatorId: user.id,
        address: contractAddress,
      });
      
      res.json(token);
    } catch (error) {
      res.status(400).json({ message: "Invalid token data", error });
    }
  });

  app.patch("/api/tokens/:id", async (req, res) => {
    try {
      const updates = req.body;
      const token = await storage.updateToken(req.params.id, updates);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
      res.json(token);
    } catch (error) {
      res.status(500).json({ message: "Failed to update token", error });
    }
  });

  // Trade routes
  app.get("/api/trades", async (req, res) => {
    try {
      const { tokenId, userId } = req.query;
      
      let trades;
      if (tokenId) {
        trades = await storage.getTradesByToken(tokenId as string);
      } else if (userId) {
        trades = await storage.getTradesByUser(userId as string);
      } else {
        return res.status(400).json({ message: "tokenId or userId required" });
      }
      
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trades", error });
    }
  });

  app.post("/api/trades", async (req, res) => {
    try {
      const tradeData = insertTradeSchema.parse(req.body);
      const { userWallet } = req.body;
      
      if (!userWallet) {
        return res.status(400).json({ message: "User wallet required" });
      }
      
      // Get or create user
      let user = await storage.getUserByWallet(userWallet);
      if (!user) {
        user = await storage.createUser({ walletAddress: userWallet });
      }
      
      const trade = await storage.createTrade({
        ...tradeData,
        userId: user.id,
      });
      
      // Update holdings
      const currentHolding = await storage.getHolding(user.id, tradeData.tokenId);
      const currentBalance = parseFloat(currentHolding?.balance || '0');
      const tradeAmount = parseFloat(tradeData.tokenAmount);
      
      let newBalance;
      let newTotalInvested = parseFloat(currentHolding?.totalInvested || '0');
      
      if (tradeData.type === 'buy') {
        newBalance = currentBalance + tradeAmount;
        newTotalInvested += parseFloat(tradeData.okbAmount);
      } else {
        newBalance = Math.max(0, currentBalance - tradeAmount);
        const sellRatio = tradeAmount / currentBalance;
        newTotalInvested *= (1 - sellRatio);
      }
      
      await storage.updateHolding(user.id, tradeData.tokenId, {
        balance: newBalance.toString(),
        totalInvested: newTotalInvested.toString(),
        avgBuyPrice: newBalance > 0 ? (newTotalInvested / newBalance).toString() : null,
      });
      
      res.json(trade);
    } catch (error) {
      res.status(400).json({ message: "Invalid trade data", error });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio/:walletAddress", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const holdings = await storage.getHoldingsByUser(user.id);
      const trades = await storage.getTradesByUser(user.id);
      
      // Get token details for holdings
      const holdingsWithTokens = await Promise.all(
        holdings.map(async (holding) => {
          const token = await storage.getToken(holding.tokenId);
          return { ...holding, token };
        })
      );
      
      res.json({
        holdings: holdingsWithTokens,
        trades,
        totalValue: holdings.reduce((sum, h) => {
          const balance = parseFloat(h.balance);
          // In real implementation, multiply by current token price
          return sum + balance * 0.001; // Mock price
        }, 0).toString(),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio", error });
    }
  });

  // Platform stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats", error });
    }
  });

  // Bonding curve calculations
  app.post("/api/bonding-curve/calculate", async (req, res) => {
    try {
      const { tokenId, okbAmount, isBuy } = req.body;
      
      if (!tokenId || !okbAmount) {
        return res.status(400).json({ message: "tokenId and okbAmount required" });
      }
      
      const token = await storage.getToken(tokenId);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }
      
      // Simplified bonding curve calculation
      // In real implementation, use actual bonding curve math
      const virtualOkb = parseFloat(token.virtualOkb);
      const virtualTokens = parseFloat(token.virtualTokens);
      const inputAmount = parseFloat(okbAmount);
      
      let outputAmount;
      let newPrice;
      
      if (isBuy) {
        // Buy: k = virtualOkb * virtualTokens
        const k = virtualOkb * virtualTokens;
        const newVirtualOkb = virtualOkb + inputAmount;
        const newVirtualTokens = k / newVirtualOkb;
        outputAmount = virtualTokens - newVirtualTokens;
        newPrice = newVirtualOkb / newVirtualTokens;
      } else {
        // Sell calculation
        const k = virtualOkb * virtualTokens;
        const newVirtualTokens = virtualTokens + inputAmount;
        const newVirtualOkb = k / newVirtualTokens;
        outputAmount = virtualOkb - newVirtualOkb;
        newPrice = newVirtualOkb / newVirtualTokens;
      }
      
      const priceImpact = Math.abs((newPrice - (virtualOkb / virtualTokens)) / (virtualOkb / virtualTokens)) * 100;
      
      res.json({
        outputAmount: outputAmount.toString(),
        newPrice: newPrice.toString(),
        priceImpact: priceImpact.toString(),
        minimumReceived: (outputAmount * 0.98).toString(), // 2% slippage
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate bonding curve", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
