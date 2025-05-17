
import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
  isRetrying?: boolean;
  variant?: 'default' | 'destructive';
  className?: string;
  action?: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  retry,
  isRetrying = false,
  variant = 'destructive',
  className = '',
  action,
}) => {
  return (
    <Alert variant={variant} className={cn(className, "animate-in fade-in-50")}>
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{message}</p>
        <div className="flex items-center gap-2 flex-wrap">
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
          {action}
        </div>
      </AlertDescription>
    </Alert>
  );
};
