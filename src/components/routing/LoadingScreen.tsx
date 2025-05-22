
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string; // Make message optional
}

export const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xl font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
