import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PositionRandomizerProps {
  onPositionsChange: (positions: number[]) => void;
}

export const PositionRandomizer = ({ onPositionsChange }: PositionRandomizerProps) => {
  const [wordCount, setWordCount] = useState<12 | 24>(12);
  const [positions, setPositions] = useState<number[]>([]);
  const [isRandomized, setIsRandomized] = useState(false);
  const { toast } = useToast();

  const generateSequential = () => {
    const sequential = Array.from({ length: wordCount }, (_, i) => i + 1);
    setPositions(sequential);
    setIsRandomized(false);
    onPositionsChange(sequential);
  };

  const generateRandom = () => {
    const sequential = Array.from({ length: wordCount }, (_, i) => i + 1);
    const shuffled = [...sequential].sort(() => Math.random() - 0.5);
    setPositions(shuffled);
    setIsRandomized(true);
    onPositionsChange(shuffled);
  };

  const copyPositions = () => {
    const positionsText = positions.join(', ');
    navigator.clipboard.writeText(positionsText);
    toast({
      title: "Copied to clipboard",
      description: "Position sequence copied successfully",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="h-5 w-5" />
          Position Randomizer
        </CardTitle>
        <CardDescription>
          Generate positions for your seed phrase words
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={wordCount === 12 ? 'default' : 'outline'}
            onClick={() => {
              setWordCount(12);
              setPositions([]);
              setIsRandomized(false);
            }}
            className="flex-1"
          >
            12 Words
          </Button>
          <Button
            variant={wordCount === 24 ? 'default' : 'outline'}
            onClick={() => {
              setWordCount(24);
              setPositions([]);
              setIsRandomized(false);
            }}
            className="flex-1"
          >
            24 Words
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={generateSequential} variant="outline" className="flex-1">
            Sequential
          </Button>
          <Button onClick={generateRandom} className="flex-1">
            Randomize
          </Button>
        </div>

        {positions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant={isRandomized ? 'default' : 'secondary'}>
                {isRandomized ? 'Randomized' : 'Sequential'}
              </Badge>
              <Button onClick={copyPositions} variant="ghost" size="sm">
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-muted rounded-md">
              {positions.map((pos, index) => (
                <div
                  key={index}
                  className="bg-background rounded px-2 py-1 text-center text-sm font-mono"
                >
                  {pos}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Security Note:</strong> Keep your actual seed phrase words private. 
            Only use these positions as a reference for organizing your words.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
