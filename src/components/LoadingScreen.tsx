
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
