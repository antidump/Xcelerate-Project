import { formatUnits, parseUnits, type Address, type Hash } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';
import { CONTRACTS, ERC20_ABI, BONDING_CURVE_ABI, TOKEN_FACTORY_ABI } from '@/config/contracts';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  balance?: bigint;
}

export interface BondingCurveState {
  virtualOkb: bigint;
  virtualTokens: bigint;
  realOkb: bigint;
  isGraduated: boolean;
}

export class Web3Service {
  private publicClient: any;
  private walletClient: any;

  constructor(publicClient: any, walletClient: any) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }

  // Token operations
  async getTokenInfo(tokenAddress: Address, userAddress?: Address): Promise<TokenInfo> {
    const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'name',
      }),
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }),
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }),
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'totalSupply',
      }),
      userAddress ? this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      }) : undefined,
    ]);

    return {
      name,
      symbol,
      decimals,
      totalSupply,
      balance,
    };
  }

  async approveToken(tokenAddress: Address, spender: Address, amount: bigint): Promise<Hash> {
    const { request } = await this.publicClient.simulateContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount],
      account: this.walletClient.account,
    });

    return await this.walletClient.writeContract(request);
  }

  async getTokenAllowance(tokenAddress: Address, owner: Address, spender: Address): Promise<bigint> {
    return await this.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [owner, spender],
    });
  }

  // Bonding curve operations
  async getBondingCurveState(tokenAddress: Address): Promise<BondingCurveState> {
    // In a real implementation, this would read from the bonding curve contract
    // For now, return mock data
    return {
      virtualOkb: parseUnits('30', 18),
      virtualTokens: parseUnits('1073000000', 18),
      realOkb: parseUnits('0', 18),
      isGraduated: false,
    };
  }

  async calculateBondingCurveOutput(
    tokenAddress: Address,
    inputAmount: bigint,
    isBuy: boolean
  ): Promise<bigint> {
    return await this.publicClient.readContract({
      address: CONTRACTS.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'calculateTokens',
      args: [tokenAddress, inputAmount, isBuy],
    });
  }

  async buyTokens(
    tokenAddress: Address,
    okbAmount: bigint,
    minTokens: bigint
  ): Promise<Hash> {
    const { request } = await this.publicClient.simulateContract({
      address: CONTRACTS.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'buyTokens',
      args: [tokenAddress, okbAmount, minTokens],
      value: okbAmount,
      account: this.walletClient.account,
    });

    return await this.walletClient.writeContract(request);
  }

  async sellTokens(
    tokenAddress: Address,
    tokenAmount: bigint,
    minOkb: bigint
  ): Promise<Hash> {
    // First check and approve if needed
    const allowance = await this.getTokenAllowance(
      tokenAddress,
      this.walletClient.account.address,
      CONTRACTS.BONDING_CURVE
    );

    if (allowance < tokenAmount) {
      await this.approveToken(tokenAddress, CONTRACTS.BONDING_CURVE, tokenAmount);
    }

    const { request } = await this.publicClient.simulateContract({
      address: CONTRACTS.BONDING_CURVE,
      abi: BONDING_CURVE_ABI,
      functionName: 'sellTokens',
      args: [tokenAddress, tokenAmount, minOkb],
      account: this.walletClient.account,
    });

    return await this.walletClient.writeContract(request);
  }

  // Token factory operations
  async createToken(
    name: string,
    symbol: string,
    description: string,
    imageUrl: string,
    creationFee: bigint
  ): Promise<Hash> {
    const { request } = await this.publicClient.simulateContract({
      address: CONTRACTS.TOKEN_FACTORY,
      abi: TOKEN_FACTORY_ABI,
      functionName: 'createToken',
      args: [name, symbol, description, imageUrl],
      value: creationFee,
      account: this.walletClient.account,
    });

    return await this.walletClient.writeContract(request);
  }

  // Utility functions
  formatTokenAmount(amount: bigint, decimals: number): string {
    return formatUnits(amount, decimals);
  }

  parseTokenAmount(amount: string, decimals: number): bigint {
    return parseUnits(amount, decimals);
  }

  formatOkbAmount(amount: bigint): string {
    return formatUnits(amount, 18);
  }

  parseOkbAmount(amount: string): bigint {
    return parseUnits(amount, 18);
  }
}

// Hook to use Web3Service
export function useWeb3Service() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  if (!publicClient) {
    throw new Error('Public client not available');
  }

  return new Web3Service(publicClient, walletClient);
}

// Utility functions for bonding curve calculations
export function calculateBondingCurvePrice(virtualOkb: bigint, virtualTokens: bigint): number {
  const okbFloat = parseFloat(formatUnits(virtualOkb, 18));
  const tokensFloat = parseFloat(formatUnits(virtualTokens, 18));
  return okbFloat / tokensFloat;
}

export function calculateMarketCap(virtualOkb: bigint, virtualTokens: bigint, totalSupply: bigint): number {
  const price = calculateBondingCurvePrice(virtualOkb, virtualTokens);
  const totalFloat = parseFloat(formatUnits(totalSupply, 18));
  return price * totalFloat;
}

export function calculateProgress(virtualOkb: bigint, graduationThreshold: bigint): number {
  const current = parseFloat(formatUnits(virtualOkb, 18));
  const threshold = parseFloat(formatUnits(graduationThreshold, 18));
  return Math.min((current / threshold) * 100, 100);
}

// Transaction helper functions
export async function waitForTransaction(hash: Hash, publicClient: any): Promise<any> {
  return await publicClient.waitForTransactionReceipt({ hash });
}

export function isTransactionSuccessful(receipt: any): boolean {
  return receipt.status === 'success';
}

// Error handling utilities
export function parseContractError(error: any): string {
  if (error.message.includes('User rejected')) {
    return 'Transaction was rejected by user';
  }
  
  if (error.message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  
  if (error.message.includes('execution reverted')) {
    return 'Transaction failed - check parameters and try again';
  }
  
  return error.message || 'Transaction failed';
}

export { type Address, type Hash };
