import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { X, Upload, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { insertTokenSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { CONTRACTS, TOKEN_FACTORY_ABI, CONSTANTS } from '@/config/contracts';
import type { InsertToken } from '@shared/schema';

interface CreateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTokenModal({ isOpen, onClose }: CreateTokenModalProps) {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const { writeContract, data: txHash, isPending: isWriting } = useWriteContract();
  const [isUploading, setIsUploading] = useState(false);

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const form = useForm<InsertToken>({
    resolver: zodResolver(insertTokenSchema),
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      imageUrl: '',
    },
  });

  // Create token mutation
  const createTokenMutation = useMutation({
    mutationFn: async (data: InsertToken) => {
      if (!isConnected || !address) {
        throw new Error('Please connect your wallet first');
      }

      // Create token contract first
      writeContract({
        address: CONTRACTS.TOKEN_FACTORY,
        abi: TOKEN_FACTORY_ABI,
        functionName: 'createToken',
        args: [data.name, data.symbol, data.description || '', data.imageUrl || ''],
        value: parseEther(CONSTANTS.CREATION_FEE),
      });

      return data;
    },
    onError: (error) => {
      toast({
        title: 'Token Creation Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Record token in database after successful deployment
  const recordTokenMutation = useMutation({
    mutationFn: async ({ tokenData, contractAddress }: { tokenData: InsertToken; contractAddress: string }) => {
      const response = await apiRequest('POST', '/api/tokens', {
        ...tokenData,
        creatorWallet: address,
        contractAddress,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tokens'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: 'Token Created Successfully!',
        description: 'Your token has been deployed and is now live on the bonding curve.',
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Failed to record token',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertToken) => {
    createTokenMutation.mutate(data);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please choose an image under 10MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      // In a real app, upload to IPFS or cloud storage
      // For now, create a mock URL
      const mockUrl = `https://example.com/token-images/${Date.now()}-${file.name}`;
      form.setValue('imageUrl', mockUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your token image has been uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = createTokenMutation.isPending || isWriting || isConfirming || isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card-dark max-w-md border-border" data-testid="modal-create-token">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Token</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Super Doge"
                      className="glass-card bg-transparent border-border"
                      data-testid="input-token-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., SDOGE"
                      className="glass-card bg-transparent border-border uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={10}
                      data-testid="input-token-symbol"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell everyone about your token..."
                      rows={3}
                      className="glass-card bg-transparent border-border resize-none"
                      maxLength={500}
                      data-testid="input-token-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <label
                        htmlFor="image-upload"
                        className="glass-card border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-white/50 transition-colors block"
                        data-testid="upload-token-image"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">PNG, JPG up to 10MB</p>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                      {field.value && (
                        <div className="text-sm text-green-400 text-center">
                          Image uploaded successfully
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fee Information */}
            <div className="glass-card p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">Creation Fee: 0.001 OKB</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 glass-card hover:bg-white/10"
                disabled={isLoading}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-white text-black hover:bg-gray-100"
                disabled={isLoading || !isConnected}
                data-testid="button-create-token"
              >
                {isLoading ? 'Creating...' : 'Create Token'}
              </Button>
            </div>

            {!isConnected && (
              <p className="text-sm text-yellow-400 text-center">
                Please connect your wallet to create a token
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
