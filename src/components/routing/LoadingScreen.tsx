
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex items-center space-x-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div>
          <h2 className="text-xl font-bold">Loading</h2>
          <p className="text-muted-foreground">Please wait while we prepare your experience...</p>
        </div>
      </div>
    </div>
  );
};
