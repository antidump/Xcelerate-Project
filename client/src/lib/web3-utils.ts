import { xLayer } from '@/config/wagmi';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const addXLayerNetwork = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Try to switch to X Layer network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xC4' }], // 196 in hex
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xC4',
                chainName: 'X Layer',
                nativeCurrency: {
                  name: 'OKB',
                  symbol: 'OKB',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.xlayer.tech'],
                blockExplorerUrls: ['https://www.oklink.com/xlayer'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding X Layer network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to X Layer network:', switchError);
        throw switchError;
      }
    }
  }
};