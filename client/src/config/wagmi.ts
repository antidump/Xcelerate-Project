import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import {
  metaMaskWallet,
  okxWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

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
      webSocket: ['wss://ws.xlayer.tech'],
    },
  },
  blockExplorers: {
    default: {
      name: 'OKLink',
      url: 'https://www.oklink.com/xlayer',
    },
  },
  testnet: false,
});

export const wagmiConfig = getDefaultConfig({
  appName: 'Xcelerate',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'c3794de0-7e89-4d67-8142-8c4b9d8e9b4a',
  chains: [xLayer],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        okxWallet,
        walletConnectWallet,
      ],
    },
  ],
  ssr: false,
});
