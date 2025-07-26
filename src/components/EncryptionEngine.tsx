import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Lock, Unlock, Clock, TrendingUp, Copy, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EncryptionEngineProps {
  mode: 'onchain' | 'offchain';
  positions: number[];
}

export const EncryptionEngine = ({ mode, positions }: EncryptionEngineProps) => {
  const [note, setNote] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  
  // Conditions
  const [timeLockEnabled, setTimeLockEnabled] = useState(false);
  const [timeLockDays, setTimeLockDays] = useState(3);
  const [priceLockEnabled, setPriceLockEnabled] = useState(false);
  const [priceSymbol, setPriceSymbol] = useState('XAUUSD');
  const [priceThreshold, setPriceThreshold] = useState(2400);
  
  const { toast } = useToast();

  const encrypt = async () => {
    if (!note.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note to encrypt",
        variant: "destructive"
      });
      return;
    }

    try {
      let encrypted = '';
      
      if (mode === 'offchain') {
        // Simple local encryption (in real app, use proper crypto)
        const data = {
          note,
          positions: positions.length > 0 ? positions : null,
          conditions: {
            timeLock: timeLockEnabled ? { days: timeLockDays, unlockDate: new Date(Date.now() + timeLockDays * 24 * 60 * 60 * 1000) } : null,
            priceLock: priceLockEnabled ? { symbol: priceSymbol, threshold: priceThreshold } : null
          },
          timestamp: new Date().toISOString()
        };
        encrypted = btoa(JSON.stringify(data));
      } else {
        // Lit Protocol integration placeholder
        // In real implementation, this would use Lit SDK
        const conditions = [];
        
        if (timeLockEnabled) {
          conditions.push({
            conditionType: 'evmBasic',
            contractAddress: '',
            standardContractType: '',
            chain: 'ethereum',
            method: '',
            parameters: [':userAddress'],
            returnValueTest: {
              comparator: '>=',
              value: Math.floor(Date.now() / 1000) + (timeLockDays * 24 * 60 * 60)
            }
          });
        }
        
        if (priceLockEnabled) {
          // Price condition would require oracle integration
          conditions.push({
            conditionType: 'evmContract',
            contractAddress: '0x...', // Oracle contract
            functionName: 'getPrice',
            functionParams: [priceSymbol],
            functionAbi: {},
            chain: 'ethereum',
            returnValueTest: {
              comparator: '>',
              value: priceThreshold.toString()
            }
          });
        }
        
        // Placeholder encrypted string
        encrypted = `lit_encrypted_${btoa(JSON.stringify({ note, positions, conditions, timestamp: Date.now() }))}`;
      }
      
      setEncryptedData(encrypted);
      setIsEncrypted(true);
      
      toast({
        title: "Encryption Successful",
        description: `Note encrypted using ${mode} mode`,
      });
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const decrypt = async () => {
    if (!encryptedData) {
      toast({
        title: "Error",
        description: "No encrypted data to decrypt",
        variant: "destructive"
      });
      return;
    }

    try {
      if (mode === 'offchain') {
        const decrypted = JSON.parse(atob(encryptedData));
        
        // Check conditions
        if (decrypted.conditions.timeLock) {
          const unlockDate = new Date(decrypted.conditions.timeLock.unlockDate);
          if (new Date() < unlockDate) {
            toast({
              title: "Time Lock Active",
              description: `Cannot decrypt until ${unlockDate.toLocaleDateString()}`,
              variant: "destructive"
            });
            return;
          }
        }
        
        if (decrypted.conditions.priceLock) {
          // In real app, check current price via Binance API
          toast({
            title: "Price Check Required",
            description: `Checking ${decrypted.conditions.priceLock.symbol} price...`,
          });
          // Simulate price check
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        setNote(decrypted.note);
        if (decrypted.positions) {
          // positions would be handled by parent component
        }
      } else {
        // Lit Protocol decryption placeholder
        // In real implementation, this would use Lit SDK to decrypt
        const data = JSON.parse(atob(encryptedData.replace('lit_encrypted_', '')));
        setNote(data.note);
      }
      
      setIsEncrypted(false);
      
      toast({
        title: "Decryption Successful",
        description: "Note decrypted successfully",
      });
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: "Invalid encrypted data or conditions not met",
        variant: "destructive"
      });
    }
  };

  const copyEncrypted = () => {
    navigator.clipboard.writeText(encryptedData);
    toast({
      title: "Copied to clipboard",
      description: "Encrypted data copied successfully",
    });
  };

  const resetForm = () => {
    setNote('');
    setEncryptedData('');
    setIsEncrypted(false);
    setTimeLockEnabled(false);
    setPriceLockEnabled(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEncrypted ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
          Encryption Engine
        </CardTitle>
        <CardDescription>
          Encrypt your notes with time and price conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="note">Your Note</Label>
          <Textarea
            id="note"
            placeholder="Enter your private note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1"
            rows={4}
            disabled={isEncrypted}
          />
          {positions.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Position sequence will be included: {positions.slice(0, 6).join(', ')}...
            </p>
          )}
        </div>

        {/* Time Lock */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Lock
            </Label>
            <Switch checked={timeLockEnabled} onCheckedChange={setTimeLockEnabled} />
          </div>
          {timeLockEnabled && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={timeLockDays}
                onChange={(e) => setTimeLockDays(Number(e.target.value))}
                className="w-20"
                min="1"
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          )}
        </div>

        {/* Price Lock */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Price Lock
            </Label>
            <Switch checked={priceLockEnabled} onCheckedChange={setPriceLockEnabled} />
          </div>
          {priceLockEnabled && (
            <div className="flex items-center gap-2">
              <Input
                value={priceSymbol}
                onChange={(e) => setPriceSymbol(e.target.value)}
                className="w-24"
                placeholder="XAUUSD"
              />
              <span className="text-sm">></span>
              <Input
                type="number"
                value={priceThreshold}
                onChange={(e) => setPriceThreshold(Number(e.target.value))}
                className="w-24"
              />
            </div>
          )}
        </div>

        {/* Mode indicator */}
        <div className="flex items-center gap-2">
          <Badge variant={mode === 'onchain' ? 'default' : 'secondary'}>
            {mode === 'onchain' ? 'Lit Protocol' : 'Local Encryption'}
          </Badge>
          {mode === 'onchain' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>Requires wallet connection</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {!isEncrypted ? (
            <Button onClick={encrypt} className="flex-1">
              <Lock className="h-4 w-4 mr-2" />
              Encrypt
            </Button>
          ) : (
            <>
              <Button onClick={decrypt} variant="outline" className="flex-1">
                <Unlock className="h-4 w-4 mr-2" />
                Decrypt
              </Button>
              <Button onClick={copyEncrypted} variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button onClick={resetForm} variant="ghost" size="sm">
            Reset
          </Button>
        </div>

        {/* Encrypted output */}
        {encryptedData && (
          <div className="space-y-2">
            <Label>Encrypted Output</Label>
            <Textarea
              value={encryptedData}
              readOnly
              className="font-mono text-xs"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Save this encrypted string securely. You'll need it to decrypt your note.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
