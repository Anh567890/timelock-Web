import { useState } from 'react';
import { WalletConnect } from '@/components/WalletConnect';
import { PositionRandomizer } from '@/components/PositionRandomizer';
import { EncryptionEngine } from '@/components/EncryptionEngine';
import { PaymentModule } from '@/components/PaymentModule';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const [mode, setMode] = useState<'onchain' | 'offchain'>('offchain');
  const [positions, setPositions] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ChronoLock Notes
            </h1>
            <p className="text-muted-foreground">Secure time & price-locked encryption</p>
          </div>
          <Button onClick={toggleTheme} variant="ghost" size="sm">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <WalletConnect onModeChange={setMode} currentMode={mode} />
            <PositionRandomizer onPositionsChange={setPositions} />
          </div>
          
          <div className="space-y-6">
            <EncryptionEngine mode={mode} positions={positions} />
            <PaymentModule />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
