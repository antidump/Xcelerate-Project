import { type User, type InsertUser, type Token, type InsertToken, type Trade, type InsertTrade, type Holding, type PlatformStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Token methods
  getToken(id: string): Promise<Token | undefined>;
  getTokenByAddress(address: string): Promise<Token | undefined>;
  getTokensByCreator(creatorId: string): Promise<Token[]>;
  getAllTokens(filter?: { isGraduated?: boolean }): Promise<Token[]>;
  createToken(token: InsertToken & { creatorId: string; address: string }): Promise<Token>;
  updateToken(id: string, updates: Partial<Token>): Promise<Token | undefined>;

  // Trade methods
  getTrade(id: string): Promise<Trade | undefined>;
  getTradesByToken(tokenId: string): Promise<Trade[]>;
  getTradesByUser(userId: string): Promise<Trade[]>;
  createTrade(trade: InsertTrade & { userId: string }): Promise<Trade>;

  // Holdings methods
  getHolding(userId: string, tokenId: string): Promise<Holding | undefined>;
  getHoldingsByUser(userId: string): Promise<Holding[]>;
  updateHolding(userId: string, tokenId: string, updates: Partial<Holding>): Promise<Holding>;

  // Platform stats
  getPlatformStats(): Promise<PlatformStats | undefined>;
  updatePlatformStats(stats: Partial<PlatformStats>): Promise<PlatformStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tokens: Map<string, Token> = new Map();
  private trades: Map<string, Trade> = new Map();
  private holdings: Map<string, Holding> = new Map();
  private platformStats: PlatformStats | undefined;

  constructor() {
    // Initialize with mock platform stats
    this.platformStats = {
      id: randomUUID(),
      totalTokens: 0,
      totalVolume: '0',
      totalUsers: 0,
      graduatedTokens: 0,
      dailyStats: {},
      updatedAt: new Date(),
    };
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => 
      user.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    
    // Update platform stats
    if (this.platformStats) {
      this.platformStats.totalUsers += 1;
      this.platformStats.updatedAt = new Date();
    }
    
    return user;
  }

  // Token methods
  async getToken(id: string): Promise<Token | undefined> {
    return this.tokens.get(id);
  }

  async getTokenByAddress(address: string): Promise<Token | undefined> {
    return Array.from(this.tokens.values()).find(token => 
      token.address.toLowerCase() === address.toLowerCase()
    );
  }

  async getTokensByCreator(creatorId: string): Promise<Token[]> {
    return Array.from(this.tokens.values()).filter(token => token.creatorId === creatorId);
  }

  async getAllTokens(filter?: { isGraduated?: boolean }): Promise<Token[]> {
    let allTokens = Array.from(this.tokens.values());
    
    if (filter?.isGraduated !== undefined) {
      allTokens = allTokens.filter(token => token.isGraduated === filter.isGraduated);
    }
    
    return allTokens.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createToken(tokenData: InsertToken & { creatorId: string; address: string }): Promise<Token> {
    const id = randomUUID();
    const token: Token = {
      ...tokenData,
      description: tokenData.description || null,
      imageUrl: tokenData.imageUrl || null,
      id,
      totalSupply: '1000000000000000000000000000', // 1B tokens with 18 decimals
      virtualOkb: '30000000000000000000', // 30 OKB
      virtualTokens: '1073000000000000000000000000', // 1.073B tokens
      isGraduated: false,
      graduatedAt: null,
      currentPrice: '0',
      marketCap: '0',
      volume24h: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tokens.set(id, token);
    
    // Update platform stats
    if (this.platformStats) {
      this.platformStats.totalTokens += 1;
      this.platformStats.updatedAt = new Date();
    }
    
    return token;
  }

  async updateToken(id: string, updates: Partial<Token>): Promise<Token | undefined> {
    const token = this.tokens.get(id);
    if (!token) return undefined;
    
    const updatedToken = { ...token, ...updates, updatedAt: new Date() };
    this.tokens.set(id, updatedToken);
    return updatedToken;
  }

  // Trade methods
  async getTrade(id: string): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async getTradesByToken(tokenId: string): Promise<Trade[]> {
    return Array.from(this.trades.values())
      .filter(trade => trade.tokenId === tokenId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTradesByUser(userId: string): Promise<Trade[]> {
    return Array.from(this.trades.values())
      .filter(trade => trade.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTrade(tradeData: InsertTrade & { userId: string }): Promise<Trade> {
    const id = randomUUID();
    const trade: Trade = {
      ...tradeData,
      id,
      createdAt: new Date(),
    };
    
    this.trades.set(id, trade);
    
    // Update platform stats
    if (this.platformStats) {
      const currentVolume = parseFloat(this.platformStats.totalVolume || '0');
      const tradeVolume = parseFloat(tradeData.okbAmount);
      this.platformStats.totalVolume = (currentVolume + tradeVolume).toString();
      this.platformStats.updatedAt = new Date();
    }
    
    return trade;
  }

  // Holdings methods
  async getHolding(userId: string, tokenId: string): Promise<Holding | undefined> {
    const key = `${userId}-${tokenId}`;
    return this.holdings.get(key);
  }

  async getHoldingsByUser(userId: string): Promise<Holding[]> {
    return Array.from(this.holdings.values()).filter(holding => holding.userId === userId);
  }

  async updateHolding(userId: string, tokenId: string, updates: Partial<Holding>): Promise<Holding> {
    const key = `${userId}-${tokenId}`;
    const existing = this.holdings.get(key);
    
    const holding: Holding = {
      id: existing?.id || randomUUID(),
      userId,
      tokenId,
      balance: '0',
      avgBuyPrice: null,
      totalInvested: '0',
      updatedAt: new Date(),
      ...existing,
      ...updates,
    };
    
    this.holdings.set(key, holding);
    return holding;
  }

  // Platform stats
  async getPlatformStats(): Promise<PlatformStats | undefined> {
    return this.platformStats;
  }

  async updatePlatformStats(stats: Partial<PlatformStats>): Promise<PlatformStats> {
    this.platformStats = {
      ...this.platformStats!,
      ...stats,
      updatedAt: new Date(),
    };
    return this.platformStats;
  }
}

export const storage = new MemStorage();
