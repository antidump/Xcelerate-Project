import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import type { Token } from '@shared/schema';

interface TokenGridProps {
  onTokenSelect: (token: Token) => void;
}

export default function TokenGrid({ onTokenSelect }: TokenGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  const { data: tokens = [], isLoading } = useQuery<Token[]>({
    queryKey: ['/api/tokens'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Filter and sort tokens
  const filteredTokens = tokens
    .filter((token: Token) => {
      const matchesSearch = 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterBy === 'all' ||
        (filterBy === 'active' && !token.isGraduated) ||
        (filterBy === 'graduated' && token.isGraduated);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a: Token, b: Token) => {
      switch (sortBy) {
        case 'volume':
          return parseFloat(b.volume24h || '0') - parseFloat(a.volume24h || '0');
        case 'progress':
          const progressA = (token: Token) => {
            const virtualOkb = parseFloat(token.virtualOkb);
            const graduationThreshold = 80;
            return (virtualOkb / graduationThreshold) * 100;
          };
          return progressA(b) - progressA(a);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const calculateProgress = (token: Token) => {
    const virtualOkb = parseFloat(token.virtualOkb);
    const graduationThreshold = 80; // 80 OKB
    return Math.min((virtualOkb / graduationThreshold) * 100, 100);
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price || '0');
    if (num === 0) return '₪0.00';
    if (num < 0.01) return `₪${num.toFixed(6)}`;
    return `₪${num.toFixed(4)}`;
  };

  const formatMarketCap = (marketCap: string) => {
    const num = parseFloat(marketCap || '0');
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M OKB`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k OKB`;
    return `${num.toFixed(1)} OKB`;
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-black/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-3 bg-muted rounded w-12"></div>
                  </div>
                </div>
                <div className="h-10 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-2 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-black/50" id="discover">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Discover Tokens</h2>
            <p className="text-muted-foreground text-lg">Find the next big meme token on the bonding curve</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-6 lg:mt-0">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="glass-card bg-transparent border-border w-40" data-testid="filter-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tokens</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="glass-card bg-transparent border-border w-40" data-testid="sort-by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-card bg-transparent border-border pl-10 min-w-60"
                data-testid="input-search-tokens"
              />
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Token Grid */}
        {filteredTokens.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tokens found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredTokens.map((token: Token, index: number) => {
              const progress = calculateProgress(token);
              
              return (
                <motion.div
                  key={token.id}
                  className="glass-card p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 token-card cursor-pointer"
                  onClick={() => onTokenSelect(token)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  data-testid={`token-card-${token.symbol}`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg truncate">{token.name}</h3>
                      <p className="text-sm text-muted-foreground">{token.symbol}</p>
                    </div>
                    {token.isGraduated && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Graduated
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {token.description || 'No description available'}
                  </p>
                  
                  {!token.isGraduated && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-white to-gray-300 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Price</div>
                      <div className="font-medium">{formatPrice(token.currentPrice || '0')}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">
                        {token.isGraduated ? '24h Volume' : 'Market Cap'}
                      </div>
                      <div className="font-medium">
                        {token.isGraduated 
                          ? formatMarketCap(token.volume24h || '0')
                          : formatMarketCap(token.marketCap || '0')
                        }
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Load More */}
        {filteredTokens.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="ghost"
              className="glass-card hover:bg-white/10 px-8 py-4 rounded-2xl font-medium transition-all duration-300"
              data-testid="button-load-more"
            >
              Load More Tokens
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
