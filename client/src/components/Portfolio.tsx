import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Download, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Portfolio() {
  const { address, isConnected } = useAccount();

  const { data: portfolio, isLoading } = useQuery<any>({
    queryKey: ['/api/portfolio', address],
    enabled: isConnected && !!address,
  });

  const formatCurrency = (amount: string, symbol = 'OKB') => {
    const num = parseFloat(amount);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M ${symbol}`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}k ${symbol}`;
    return `${num.toFixed(4)} ${symbol}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  if (!isConnected) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-b from-black/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to view your portfolio and token holdings
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-b from-black/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const mockStats = {
    totalValue: portfolio?.totalValue || '0',
    totalPnL: '5.23',
    totalPnLPercent: 12.42,
    totalHoldings: portfolio?.holdings?.length || 0,
    bestPerformer: 340,
    bestToken: 'MOON',
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-black/50 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Your Portfolio</h2>
            <p className="text-muted-foreground text-lg">Track your token holdings and performance</p>
          </div>
          <Button
            variant="ghost"
            className="glass-card hover:bg-white/10"
            data-testid="button-export-portfolio"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card border-border">
            <CardHeader className="pb-2">
              <CardDescription>Total Value</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(mockStats.totalValue)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {formatPercentage(mockStats.totalPnLPercent)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader className="pb-2">
              <CardDescription>Total P&L</CardDescription>
              <CardTitle className="text-2xl text-green-400">
                +{formatCurrency(mockStats.totalPnL)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {formatPercentage(mockStats.totalPnLPercent)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader className="pb-2">
              <CardDescription>Holdings</CardDescription>
              <CardTitle className="text-2xl">{mockStats.totalHoldings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Active tokens</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border">
            <CardHeader className="pb-2">
              <CardDescription>Best Performer</CardDescription>
              <CardTitle className="text-2xl text-green-400">
                {formatPercentage(mockStats.bestPerformer)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{mockStats.bestToken}</div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Token Holdings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!portfolio?.holdings || portfolio.holdings.length === 0 ? (
              <div className="text-center py-16">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Holdings Yet</h3>
                <p className="text-muted-foreground">
                  Start trading tokens to see your portfolio here
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Token</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.holdings.map((holding: any) => {
                    const mockPnL = Math.random() * 50 - 10; // Mock P&L calculation
                    const isPositive = mockPnL >= 0;
                    
                    return (
                      <TableRow 
                        key={holding.id} 
                        className="border-border hover:bg-white/5"
                        data-testid={`holding-row-${holding.token?.symbol}`}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                              {holding.token?.symbol?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="font-medium">{holding.token?.name || 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">
                                {holding.token?.symbol || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(holding.balance, '').replace(' ', '')}
                          </div>
                          <div className="text-sm text-muted-foreground">tokens</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency((parseFloat(holding.balance) * 0.001).toString())}
                          </div>
                          <div className="text-sm text-muted-foreground">$892.34</div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {formatPercentage(mockPnL)}
                          </div>
                          <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}
                            {formatCurrency((mockPnL * 0.1).toString())}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="glass-card hover:bg-white/10"
                            data-testid={`button-trade-${holding.token?.symbol}`}
                          >
                            Trade
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
