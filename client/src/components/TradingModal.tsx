import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { X, ArrowDown, ShoppingCart, TrendingDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useBondingCurve } from '@/hooks/useBondingCurve';
import { toast } from '@/hooks/use-toast';
import type { Token } from '@shared/schema';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token | null;
}

export default function TradingModal({ isOpen, onClose, token }: TradingModalProps) {
  const { address, isConnected } = useAccount();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    calculateTrade,
    slippageTolerance,
    setSlippageTolerance,
    buyTokens,
    sellTokens,
    isBuying,
    isSelling,
  } = useBondingCurve(token?.id);

  // Mock user balances
  const { data: userBalances } = useQuery({
    queryKey: ['/api/portfolio', address],
    enabled: isConnected && !!address,
  });

  const calculateProgress = () => {
    if (!token) return 0;
    const virtualOkb = parseFloat(token.virtualOkb);
    const graduationThreshold = 80; // 80 OKB
    return Math.min((virtualOkb / graduationThreshold) * 100, 100);
  };

  const handleAmountChange = async (value: string) => {
    setPayAmount(value);
    
    if (!value || parseFloat(value) <= 0 || !token) {
      setReceiveAmount('');
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateTrade(value, tradeType === 'buy');
      setReceiveAmount(parseFloat(result.outputAmount).toFixed(6));
    } catch (error) {
      console.error('Calculation error:', error);
      setReceiveAmount('');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    // Mock balance calculation
    const mockBalance = tradeType === 'buy' ? 10 : 1000; // 10 OKB or 1000 tokens
    const amount = (mockBalance * percentage / 100).toString();
    handleAmountChange(amount);
  };

  const handleTrade = () => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to trade',
        variant: 'destructive',
      });
      return;
    }

    if (!payAmount || !receiveAmount) {
      toast({
        title: 'Invalid amounts',
        description: 'Please enter valid trade amounts',
        variant: 'destructive',
      });
      return;
    }

    const minReceived = (parseFloat(receiveAmount) * (100 - slippageTolerance) / 100).toString();

    if (tradeType === 'buy') {
      buyTokens({
        okbAmount: payAmount,
        minTokens: minReceived,
      });
    } else {
      sellTokens({
        tokenAmount: payAmount,
        minOkb: minReceived,
      });
    }
  };

  const progress = calculateProgress();
  const isLoading = isBuying || isSelling;

  if (!token) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card-dark max-w-lg border-border" data-testid="modal-trading">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {token.symbol.charAt(0)}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{token.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {token.currentPrice ? `₪${parseFloat(token.currentPrice).toFixed(6)}` : 'Price loading...'}
                </p>
              </div>
            </div>
            {token.isGraduated && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                Graduated
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Bonding Curve Progress */}
        {!token.isGraduated && (
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Bonding Curve Progress</span>
              <span>{progress.toFixed(0)}% to graduation</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full relative transition-all duration-300"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{parseFloat(token.virtualOkb).toFixed(1)} / 80 OKB</span>
              <span>{(80 - parseFloat(token.virtualOkb)).toFixed(1)} OKB to DEX</span>
            </div>
          </div>
        )}

        {/* Trading Tabs */}
        <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as 'buy' | 'sell')}>
          <TabsList className="glass-card w-full">
            <TabsTrigger value="buy" className="flex-1" data-testid="tab-buy">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex-1" data-testid="tab-sell">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-6 mt-6">
            <TradingForm
              tradeType="buy"
              payAmount={payAmount}
              receiveAmount={receiveAmount}
              isCalculating={isCalculating}
              onAmountChange={handleAmountChange}
              onQuickAmount={handleQuickAmount}
              onTrade={handleTrade}
              isLoading={isLoading}
              isConnected={isConnected}
              token={token}
              slippageTolerance={slippageTolerance}
            />
          </TabsContent>

          <TabsContent value="sell" className="space-y-6 mt-6">
            <TradingForm
              tradeType="sell"
              payAmount={payAmount}
              receiveAmount={receiveAmount}
              isCalculating={isCalculating}
              onAmountChange={handleAmountChange}
              onQuickAmount={handleQuickAmount}
              onTrade={handleTrade}
              isLoading={isLoading}
              isConnected={isConnected}
              token={token}
              slippageTolerance={slippageTolerance}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface TradingFormProps {
  tradeType: 'buy' | 'sell';
  payAmount: string;
  receiveAmount: string;
  isCalculating: boolean;
  onAmountChange: (value: string) => void;
  onQuickAmount: (percentage: number) => void;
  onTrade: () => void;
  isLoading: boolean;
  isConnected: boolean;
  token: Token;
  slippageTolerance: number;
}

function TradingForm({
  tradeType,
  payAmount,
  receiveAmount,
  isCalculating,
  onAmountChange,
  onQuickAmount,
  onTrade,
  isLoading,
  isConnected,
  token,
  slippageTolerance,
}: TradingFormProps) {
  const payCurrency = tradeType === 'buy' ? 'OKB' : token.symbol;
  const receiveCurrency = tradeType === 'buy' ? token.symbol : 'OKB';
  const mockBalance = tradeType === 'buy' ? '12.45' : '1,250.00';

  return (
    <>
      {/* You Pay */}
      <div>
        <label className="block text-sm font-medium mb-2">You Pay</label>
        <div className="glass-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <Input
              type="number"
              placeholder="0.0"
              value={payAmount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="bg-transparent text-2xl font-medium border-none p-0 focus-visible:ring-0"
              step="0.0001"
              data-testid="input-pay-amount"
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{payCurrency}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Balance: {mockBalance} {payCurrency}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="text-center">
        <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto" />
      </div>

      {/* You Receive */}
      <div>
        <label className="block text-sm font-medium mb-2">You Receive</label>
        <div className="glass-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-medium">
              {isCalculating ? '...' : receiveAmount || '0.0'}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{receiveCurrency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Details */}
      <div className="glass-card p-4 rounded-xl space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price Impact</span>
          <span className="text-yellow-400">~1.2%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Slippage Tolerance</span>
          <span>{slippageTolerance}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Minimum Received</span>
          <span>
            {receiveAmount 
              ? `~${(parseFloat(receiveAmount) * (100 - slippageTolerance) / 100).toFixed(6)} ${receiveCurrency}`
              : '--'
            }
          </span>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[25, 50, 75, 100].map((percentage) => (
          <Button
            key={percentage}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onQuickAmount(percentage)}
            className="glass-card hover:bg-white/10"
            data-testid={`button-quick-${percentage}`}
          >
            {percentage === 100 ? 'MAX' : `${percentage}%`}
          </Button>
        ))}
      </div>

      {/* Action Button */}
      <Button
        onClick={onTrade}
        disabled={isLoading || !isConnected || !payAmount || parseFloat(payAmount) <= 0}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 py-4 text-lg"
        data-testid="button-execute-trade"
      >
        {isLoading ? (
          'Processing...'
        ) : !isConnected ? (
          'Connect Wallet'
        ) : tradeType === 'buy' ? (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Buy {token.symbol}
          </>
        ) : (
          <>
            <TrendingDown className="mr-2 h-5 w-5" />
            Sell {token.symbol}
          </>
        )}
      </Button>
    </>
  );
}
