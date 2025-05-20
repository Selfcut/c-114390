
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title: string;
  message: string;
  retry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message, retry }) => {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};
