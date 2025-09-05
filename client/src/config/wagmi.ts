import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import {
  metaMaskWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets';

// X Layer testnet configuration
export const xLayerTestnet = defineChain({
  id: 1952,
  name: 'X Layer Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    default: {
      http: [
        'https://testrpc.xlayer.tech/terigon'
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'OKLink Testnet',
      url: 'https://www.oklink.com/xlayer-testnet',
    },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: 'Xcelerate',
  projectId: 'c3794de0-7e89-4d67-8142-8c4b9d8e9b4a',
  chains: [xLayerTestnet],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        okxWallet,
      ],
    },
  ],
  ssr: false,
});
