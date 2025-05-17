
import React from 'react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface ContentFeedErrorProps {
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ContentFeedError: React.FC<ContentFeedErrorProps> = ({ 
  message, 
  onRetry, 
  isRetrying 
}) => {
  return (
    <ErrorMessage
      title="Error Loading Content"
      message={message}
      retry={onRetry}
      isRetrying={isRetrying}
      variant="destructive"
    />
  );
};
