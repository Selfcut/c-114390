
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ContentErrorBoundaryProps {
  error: string;
  onRetry: () => void;
  onReset?: () => void;
}

export const ContentErrorBoundary: React.FC<ContentErrorBoundaryProps> = ({
  error,
  onRetry,
  onReset
}) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Something went wrong
        </h3>
        <p className="text-red-600 text-center mb-6 max-w-md">
          {error || 'An unexpected error occurred while loading content.'}
        </p>
        <div className="flex gap-3">
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          {onReset && (
            <Button onClick={onReset} variant="ghost">
              Reset Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
