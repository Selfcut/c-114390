
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface MediaErrorDisplayProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const MediaErrorDisplay: React.FC<MediaErrorDisplayProps> = ({ 
  message, 
  onRetry, 
  isRetrying = false 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Button onClick={onRetry} disabled={isRetrying}>
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
