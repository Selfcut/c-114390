
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Wifi, Server } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  icon = <AlertTriangle className="w-12 h-12 text-red-500" />
}) => (
  <Card className="max-w-md mx-auto">
    <CardContent className="flex flex-col items-center text-center p-6">
      {icon}
      <h3 className="text-lg font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </CardContent>
  </Card>
);

export const NetworkErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Connection Problem"
    message="Please check your internet connection and try again."
    onRetry={onRetry}
    icon={<Wifi className="w-12 h-12 text-orange-500" />}
  />
);

export const ServerErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <ErrorState
    title="Server Error"
    message="Our servers are experiencing issues. Please try again later."
    onRetry={onRetry}
    icon={<Server className="w-12 h-12 text-red-500" />}
  />
);

export const NotFoundState: React.FC<{ message?: string }> = ({ 
  message = "The content you're looking for doesn't exist or has been removed." 
}) => (
  <ErrorState
    title="Not Found"
    message={message}
    icon={<AlertTriangle className="w-12 h-12 text-yellow-500" />}
  />
);
