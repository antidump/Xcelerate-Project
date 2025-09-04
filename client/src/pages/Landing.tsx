import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TokenGrid from '@/components/TokenGrid';
import CreateTokenModal from '@/components/CreateTokenModal';
import TradingModal from '@/components/TradingModal';
import Portfolio from '@/components/Portfolio';
import Analytics from '@/components/Analytics';
import { Button } from '@/components/ui/button';
import { Rocket, Twitter, MessageCircle, Send, Github } from 'lucide-react';
import type { Token } from '@shared/schema';

export default function Landing() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleDiscoverClick = () => {
    const discoverSection = document.getElementById('discover');
    if (discoverSection) {
      discoverSection.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('discover');
    }
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsTradingModalOpen(true);
  };

  const handleCloseTradingModal = () => {
    setIsTradingModalOpen(false);
    setSelectedToken(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onCreateClick={handleCreateClick} onDiscoverClick={handleDiscoverClick} />
      
      <main>
        {/* Hero Section */}
        <Hero onCreateClick={handleCreateClick} onDiscoverClick={handleDiscoverClick} />
        
        {/* Token Discovery Section */}
        <TokenGrid onTokenSelect={handleTokenSelect} />
        
        {/* Portfolio Section */}
        <Portfolio />
        
        {/* Analytics Section */}
        <Analytics />
      </main>

      {/* Footer */}
      <footer className="glass-card-dark border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-gray-300 flex items-center justify-center">
                  <Rocket className="text-black text-lg" />
                </div>
                <span className="text-xl font-bold gradient-text">Xcelerate</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                The modern meme token launchpad on X Layer. Create, trade, and graduate your tokens to DEX automatically.
              </p>
              <div className="flex space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-discord"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-telegram"
                >
                  <Send className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-github"
                >
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button 
                    onClick={handleCreateClick}
                    className="hover:text-foreground transition-colors text-left"
                    data-testid="footer-create-token"
                  >
                    Create Token
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleDiscoverClick}
                    className="hover:text-foreground transition-colors text-left"
                    data-testid="footer-discover"
                  >
                    Discover
                  </button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors text-left" data-testid="footer-portfolio">
                    Portfolio
                  </button>
                </li>
                <li>
                  <button className="hover:text-foreground transition-colors text-left" data-testid="footer-analytics">
                    Analytics
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-docs">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-api">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-contracts">
                    Smart Contracts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-support">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 Xcelerate. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-privacy">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-terms">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors" data-testid="footer-security">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateTokenModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <TradingModal 
        isOpen={isTradingModalOpen} 
        onClose={handleCloseTradingModal}
        token={selectedToken}
      />
    </div>
  );
}
