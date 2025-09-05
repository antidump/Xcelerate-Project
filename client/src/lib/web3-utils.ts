import { xLayerTestnet } from '@/config/wagmi';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const addXLayerTestnetNetwork = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Try to switch to X Layer Testnet network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A0' }], // 1952 in hex
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x7A0',
                chainName: 'X Layer Testnet',
                nativeCurrency: {
                  name: 'OKB',
                  symbol: 'OKB',
                  decimals: 18,
                },
                rpcUrls: ['https://testrpc.xlayer.tech/terigon'],
                blockExplorerUrls: ['https://www.oklink.com/xlayer-testnet'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding X Layer Testnet network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to X Layer Testnet network:', switchError);
        throw switchError;
      }
    }
  }
};