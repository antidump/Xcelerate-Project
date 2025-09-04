import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Coins, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Analytics() {
  const { data: stats } = useQuery<any>({
    queryKey: ['/api/stats'],
    refetchInterval: 30000,
  });

  const { data: tokens = [] } = useQuery<any[]>({
    queryKey: ['/api/tokens'],
  });

  // Calculate mock analytics
  const mockAnalytics = {
    totalVolume: parseFloat(stats?.totalVolume || '0').toFixed(1),
    activeTokens: stats?.totalTokens || 0,
    totalUsers: stats?.totalUsers || 0,
    avgGradTime: '3.2',
    volumeChange: '+23.5%',
    activeTokensChange: `+${Math.floor(Math.random() * 20)} today`,
    usersChange: `+${Math.floor(Math.random() * 200)} today`,
    gradTimeChange: '-0.3 days',
  };

  // Top performing tokens (mock data for graduated tokens)
  const topTokens = tokens
    .filter((token: any) => token.isGraduated)
    .slice(0, 5)
    .map((token: any, index: number) => ({
      ...token,
      rank: index + 1,
      change24h: Math.random() * 100 - 20, // Random change between -20% and +80%
      volume24h: Math.random() * 200000,
      marketCap: Math.random() * 2000000,
    }));

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-black/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Platform Analytics</h2>
          <p className="text-muted-foreground text-lg">Real-time insights into the Xcelerate ecosystem</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="glass-card border-border text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">₪{mockAnalytics.totalVolume}M</CardTitle>
              <CardDescription>24h Volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-400">{mockAnalytics.volumeChange}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{mockAnalytics.activeTokens.toLocaleString()}</CardTitle>
              <CardDescription>Active Tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-400">{mockAnalytics.activeTokensChange}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{mockAnalytics.totalUsers.toLocaleString()}</CardTitle>
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-green-400">{mockAnalytics.usersChange}</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">{mockAnalytics.avgGradTime}</CardTitle>
              <CardDescription>Avg. Days to Graduate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-yellow-400">{mockAnalytics.gradTimeChange}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Chart */}
          <Card className="glass-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Trading Volume</CardTitle>
                <Select defaultValue="7d">
                  <SelectTrigger className="w-20 glass-card bg-transparent border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7D</SelectItem>
                    <SelectItem value="30d">30D</SelectItem>
                    <SelectItem value="90d">90D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p className="font-medium">Volume Chart</p>
                  <p className="text-sm">Recharts implementation needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Creation Chart */}
          <Card className="glass-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Token Creations</CardTitle>
                <Select defaultValue="7d">
                  <SelectTrigger className="w-20 glass-card bg-transparent border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7D</SelectItem>
                    <SelectItem value="30d">30D</SelectItem>
                    <SelectItem value="90d">90D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl">
                <div className="text-center text-muted-foreground">
                  <Coins className="h-12 w-12 mx-auto mb-4" />
                  <p className="font-medium">Token Creation Chart</p>
                  <p className="text-sm">Recharts implementation needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Tokens */}
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle>Top Performing Tokens</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {topTokens.length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Graduated Tokens Yet</h3>
                <p className="text-muted-foreground">
                  Tokens will appear here once they graduate to DEX
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Rank</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>24h Change</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Market Cap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTokens.map((token: any) => {
                    const isPositive = token.change24h >= 0;
                    
                    return (
                      <TableRow 
                        key={token.id} 
                        className="border-border hover:bg-white/5"
                        data-testid={`top-token-${token.symbol}`}
                      >
                        <TableCell className="font-medium">{token.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {token.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{token.name}</div>
                              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                                Graduated
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₪{(Math.random() * 0.1).toFixed(6)}
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}{token.change24h.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {(token.volume24h / 1000).toFixed(1)}k OKB
                        </TableCell>
                        <TableCell className="font-medium">
                          {(token.marketCap / 1000000).toFixed(1)}M OKB
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
