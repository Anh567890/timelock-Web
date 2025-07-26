import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, Zap } from 'lucide-react';

interface WalletConnectProps {
  onModeChange: (mode: 'onchain' | 'offchain') => void;
  currentMode: 'onchain' | 'offchain';
}

export const WalletConnect = ({ onModeChange, currentMode }: WalletConnectProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        onModeChange('onchain');
      } else {
        alert('Please install MetaMask');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    onModeChange('offchain');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Choose your encryption mode and connect wallet if needed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={currentMode === 'offchain' ? 'default' : 'outline'}
            onClick={() => onModeChange('offchain')}
            className="flex items-center gap-2 flex-1"
          >
            <Zap className="h-4 w-4" />
            Offchain Mode
          </Button>
          <Button
            variant={currentMode === 'onchain' ? 'default' : 'outline'}
            onClick={() => onModeChange('onchain')}
            className="flex items-center gap-2 flex-1"
          >
            <Shield className="h-4 w-4" />
            Onchain Mode
          </Button>
        </div>

        {currentMode === 'onchain' && (
          <div className="space-y-3">
            {!isConnected ? (
              <Button onClick={connectWallet} className="w-full">
                Connect MetaMask
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Connected</Badge>
                  <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground break-all">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {currentMode === 'offchain' 
            ? 'Local encryption only - no blockchain interaction'
            : 'Uses Lit Protocol for decentralized encryption'
          }
        </div>
      </CardContent>
    </Card>
  );
};
