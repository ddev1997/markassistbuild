import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertTriangle } from 'lucide-react';

export const OutOfCreditsNotice: React.FC = () => {
  return (
    <Alert className="border-destructive/50 bg-destructive/5 mb-6">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <AlertTitle className="text-destructive font-semibold">
        Out of Credits
      </AlertTitle>
      <AlertDescription className="text-destructive/80 mt-2">
        You are out of credits. Please recharge to continue using MarkAssist features.
        <div className="mt-3">
          <Button variant="destructive" size="sm" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Recharge Credits
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default OutOfCreditsNotice;