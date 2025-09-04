import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { wagmiConfig } from "./config/wagmi";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

import "@rainbow-me/rainbowkit/styles.css";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
