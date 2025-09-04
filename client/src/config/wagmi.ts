import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// X Layer network configuration
export const xLayer = defineChain({
  id: 196,
  name: 'X Layer',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.xlayer.tech'],
    },
  },
  blockExplorers: {
    default: {
      name: 'OKLink',
      url: 'https://www.oklink.com/xlayer',
    },
  },
});

export const wagmiConfig = getDefaultConfig({
  appName: 'Xcelerate',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'default-project-id',
  chains: [xLayer],
  ssr: false,
});
