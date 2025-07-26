import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PaymentModule = () => {
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Placeholder for USDT payment on BSC
      // In real implementation, this would integrate with a payment processor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsPaid(true);
      setDaysRemaining(1);
      
      toast({
        title: "Payment Successful",
        description: "Your subscription is now active for 1 day",
      });
    } catch (error) {
      toast({
        title: "Payment Failed", 
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Premium Access
        </CardTitle>
        <CardDescription>
          Pay $0.5/day for enhanced encryption features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
          <div>
            <p className="font-medium">Daily Subscription</p>
            <p className="text-sm text-muted-foreground">USDT on Binance Smart Chain</p>
          </div>
          <div className="text-right">
            <p className="font-bold">$0.5</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>

        {isPaid ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Active Subscription</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Time remaining:</span>
              </div>
              <Badge variant="secondary">
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <Button 
              onClick={handlePayment} 
              variant="outline" 
              className="w-full"
              disabled={isProcessing}
            >
              Extend Subscription
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Premium features include:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Advanced Lit Protocol integration</li>
                <li>Custom price conditions</li>
                <li>Extended time locks</li>
                <li>Priority support</li>
              </ul>
            </div>
            
            <Button 
              onClick={handlePayment} 
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay with USDT
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Payment processed via Binance Smart Chain
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
