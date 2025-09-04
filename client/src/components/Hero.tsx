import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeroProps {
  onCreateClick: () => void;
  onDiscoverClick: () => void;
}

export default function Hero({ onCreateClick, onDiscoverClick }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Fetch platform stats
  const { data: stats } = useQuery<any>({
    queryKey: ['/api/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="gradient-text">Launch Your</span><br />
            <span className="text-white">Meme Token</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl lg:text-2xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            The modern bonding curve launchpad on X Layer. Create, trade, and graduate your tokens to DEX automatically.
          </motion.p>
          
          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-12"
            variants={itemVariants}
          >
            <div className="glass-card p-6 rounded-2xl" data-testid="stat-total-tokens">
              <div className="text-3xl font-bold text-white">
                {stats?.totalTokens?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-muted-foreground">Tokens Created</div>
            </div>
            <div className="glass-card p-6 rounded-2xl" data-testid="stat-total-volume">
              <div className="text-3xl font-bold text-white">
                ₪{parseFloat(stats?.totalVolume || '0').toFixed(1)}M
              </div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="glass-card p-6 rounded-2xl" data-testid="stat-graduated-tokens">
              <div className="text-3xl font-bold text-white">
                {stats?.graduatedTokens || '0'}
              </div>
              <div className="text-sm text-muted-foreground">Graduated to DEX</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Button
              onClick={onCreateClick}
              className="bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              data-testid="button-create-token"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Token
            </Button>
            <Button
              onClick={onDiscoverClick}
              variant="ghost"
              className="glass-card hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 w-full sm:w-auto"
              data-testid="button-discover-tokens"
            >
              <Search className="mr-2 h-5 w-5" />
              Discover Tokens
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
