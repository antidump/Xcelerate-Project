import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { apiRequest } from '@/lib/queryClient';
import { CONTRACTS, BONDING_CURVE_ABI, ERC20_ABI } from '@/config/contracts';
import { toast } from '@/hooks/use-toast';

interface BondingCurveCalculation {
  outputAmount: string;
  newPrice: string;
  priceImpact: string;
  minimumReceived: string;
}

export function useBondingCurve(tokenId?: string) {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { writeContract, data: txHash, isPending: isWriting } = useWriteContract();
  
  const [slippageTolerance, setSlippageTolerance] = useState(2.0); // 2%

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Calculate bonding curve output
  const calculateTrade = async (okbAmount: string, isBuy: boolean): Promise<BondingCurveCalculation> => {
    if (!tokenId || !okbAmount || parseFloat(okbAmount) <= 0) {
      throw new Error('Invalid parameters');
    }

    const response = await apiRequest('POST', '/api/bonding-curve/calculate', {
      tokenId,
      okbAmount,
      isBuy,
    });

    return response.json();
  };

  // Get real-time calculation
  const { data: calculation, isLoading: isCalculating } = useQuery({
    queryKey: ['/api/bonding-curve/calculate', tokenId],
    enabled: false, // Manual trigger
  });

  // Buy tokens mutation
  const buyMutation = useMutation({
    mutationFn: async ({ okbAmount, minTokens }: { okbAmount: string; minTokens: string }) => {
      if (!address || !tokenId) throw new Error('Wallet not connected or token not selected');

      // Get token details first
      const tokenResponse = await fetch(`/api/tokens/${tokenId}`);
      const token = await tokenResponse.json();

      // Execute contract call with low gas price for testnet
      writeContract({
        address: CONTRACTS.BONDING_CURVE,
        abi: BONDING_CURVE_ABI,
        functionName: 'buyTokens',
        args: [token.address, parseEther(okbAmount), parseEther(minTokens)],
        value: parseEther(okbAmount),
        gasPrice: 1000000000n, // 1 gwei for testnet
      });

      return { okbAmount, minTokens, token };
    },
    onSuccess: (data) => {
      toast({
        title: 'Buy Order Submitted',
        description: `Buying ${data.token.symbol} for ${data.okbAmount} OKB`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Buy Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Sell tokens mutation
  const sellMutation = useMutation({
    mutationFn: async ({ tokenAmount, minOkb }: { tokenAmount: string; minOkb: string }) => {
      if (!address || !tokenId) throw new Error('Wallet not connected or token not selected');

      // Get token details first
      const tokenResponse = await fetch(`/api/tokens/${tokenId}`);
      const token = await tokenResponse.json();

      // First approve tokens if needed
      writeContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.BONDING_CURVE, parseEther(tokenAmount)],
        gasPrice: 1000000000n, // 1 gwei for testnet
      });

      // Then sell (in real app, wait for approval first)
      writeContract({
        address: CONTRACTS.BONDING_CURVE,
        abi: BONDING_CURVE_ABI,
        functionName: 'sellTokens',
        args: [token.address, parseEther(tokenAmount), parseEther(minOkb)],
        gasPrice: 1000000000n, // 1 gwei for testnet
      });

      return { tokenAmount, minOkb, token };
    },
    onSuccess: (data) => {
      toast({
        title: 'Sell Order Submitted',
        description: `Selling ${data.tokenAmount} ${data.token.symbol}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Sell Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Record trade after successful transaction
  const recordTrade = useMutation({
    mutationFn: async (tradeData: {
      tokenId: string;
      type: 'buy' | 'sell';
      okbAmount: string;
      tokenAmount: string;
      price: string;
      txHash: string;
    }) => {
      if (!address) throw new Error('Wallet not connected');

      const response = await apiRequest('POST', '/api/trades', {
        ...tradeData,
        userWallet: address,
      });

      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio', address] });
      queryClient.invalidateQueries({ queryKey: ['/api/tokens', tokenId] });
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
    },
  });

  // Effect to record trade when transaction succeeds
  // In real app, you'd use useEffect to watch for transaction success

  return {
    calculateTrade,
    calculation,
    isCalculating,
    slippageTolerance,
    setSlippageTolerance,
    
    // Trading functions
    buyTokens: buyMutation.mutate,
    sellTokens: sellMutation.mutate,
    isBuying: buyMutation.isPending || isWriting || isConfirming,
    isSelling: sellMutation.isPending || isWriting || isConfirming,
    
    // Transaction status
    txHash,
    isSuccess,
    
    // Trade recording
    recordTrade: recordTrade.mutate,
  };
}
