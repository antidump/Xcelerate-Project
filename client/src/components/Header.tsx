import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Rocket, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  onCreateClick: () => void;
  onDiscoverClick: () => void;
}

export default function Header({ onCreateClick, onDiscoverClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Discover', onClick: onDiscoverClick },
    { label: 'Create', onClick: onCreateClick },
    { label: 'Portfolio', onClick: () => {} },
    { label: 'Analytics', onClick: () => {} },
  ];

  return (
    <header className="glass-card-dark sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-gray-300 flex items-center justify-center">
              <Rocket className="text-black text-lg" />
            </div>
            <span className="text-xl lg:text-2xl font-bold gradient-text">Xcelerate</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Network indicator */}
            <div className="hidden sm:flex items-center space-x-2 glass-card px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">X Layer</span>
            </div>

            {/* Wallet connection */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            className="glass-card hover:bg-white/10 transition-all duration-300"
                            data-testid="button-connect-wallet"
                          >
                            <span className="hidden sm:inline">Connect Wallet</span>
                            <span className="sm:hidden">Connect</span>
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button
                            onClick={openChainModal}
                            className="glass-card hover:bg-white/10 transition-all duration-300"
                            variant="destructive"
                            data-testid="button-wrong-network"
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <Button
                          onClick={openAccountModal}
                          className="glass-card hover:bg-white/10 transition-all duration-300"
                          data-testid="button-account"
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ''}
                        </Button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            {/* Mobile menu trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-card-dark border-border">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                      data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
