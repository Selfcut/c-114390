
import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full mb-4 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="h-4 w-24 bg-primary/20 rounded mb-2"></div>
        <div className="text-sm text-muted-foreground">Loading application...</div>
      </div>
    </div>
  );
};
