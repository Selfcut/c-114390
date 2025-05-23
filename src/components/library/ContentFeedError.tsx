
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ContentFeedErrorProps {
  message: string;
  onRetry: () => void;
}

export const ContentFeedError: React.FC<ContentFeedErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-destructive">
        <AlertTriangle size={40} />
      </div>
      <h3 className="text-xl font-semibold mb-2">Error loading content</h3>
      <p className="text-muted-foreground mb-4">
        {message || "Something went wrong while loading the content."}
      </p>
      <Button onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw size={16} />
        <span>Try again</span>
      </Button>
    </div>
  );
};
