
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showIcon?: boolean;
  variant?: 'destructive' | 'default';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry,
  showIcon = true,
  variant = 'destructive'
}) => {
  return (
    <Alert variant={variant}>
      {showIcon && <AlertTriangle className="h-4 w-4" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-8"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Try Again
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
