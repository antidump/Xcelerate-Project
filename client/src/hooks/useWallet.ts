import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const queryClient = useQueryClient();

  // Get or create user when wallet connects
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/users', address],
    enabled: isConnected && !!address,
    queryFn: async () => {
      if (!address) return null;
      
      try {
        const response = await fetch(`/api/users/${address}`);
        if (response.ok) {
          return response.json();
        }
        
        // User doesn't exist, create new one
        const createResponse = await apiRequest('POST', '/api/users', {
          walletAddress: address,
        });
        return createResponse.json();
      } catch (error) {
        console.error('Error fetching/creating user:', error);
        return null;
      }
    },
  });

  const connectWallet = (connectorId?: string) => {
    const connector = connectors.find(c => c.id === connectorId) || connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const disconnectWallet = () => {
    disconnect();
    queryClient.clear();
  };

  return {
    address,
    isConnected,
    user,
    isLoadingUser,
    connectWallet,
    disconnectWallet,
    connectors,
  };
}
