
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...", 
  fullScreen = true 
}) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50" 
    : "w-full h-full min-h-[200px]";

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center`}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};
