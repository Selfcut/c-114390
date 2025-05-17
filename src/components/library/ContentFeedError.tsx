
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ContentFeedErrorProps {
  message: string;
  onRetry: () => void;
}

export const ContentFeedError: React.FC<ContentFeedErrorProps> = ({ message, onRetry }) => {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load content</h3>
        <p className="text-muted-foreground text-center mb-4">{message}</p>
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw size={16} />
          <span>Try Again</span>
        </Button>
      </CardContent>
    </Card>
  );
};
