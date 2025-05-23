
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ContentFeedErrorProps {
  message: string;
  onRetry: () => void;
}

export const ContentFeedError: React.FC<ContentFeedErrorProps> = ({
  message,
  onRetry
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-16 w-16 text-red-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Error Loading Content
        </h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          {message}
        </p>
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};
