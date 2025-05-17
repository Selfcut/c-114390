
import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
  isRetrying?: boolean;
  variant?: 'default' | 'destructive' | 'subtle';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  retry,
  isRetrying = false,
  variant = 'destructive',
  className = '',
}) => {
  return (
    <Alert variant={variant} className={className}>
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{message}</p>
        {retry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retry} 
            disabled={isRetrying}
            className="w-fit flex items-center gap-2"
          >
            {isRetrying ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4" />
                Retry
              </>
            )}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
