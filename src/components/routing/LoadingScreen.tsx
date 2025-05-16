
import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
        <div className="h-4 w-24 bg-primary/20 rounded"></div>
      </div>
    </div>
  );
};
