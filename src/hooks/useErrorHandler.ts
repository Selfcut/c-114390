
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorDetails {
  code?: string;
  context?: string;
  retryable?: boolean;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | unknown,
    details?: ErrorDetails
  ) => {
    console.error('Error handled:', error, details);

    let message = 'An unexpected error occurred';
    let title = 'Error';

    if (error instanceof Error) {
      message = error.message;
      
      // Handle specific error types
      if (error.message.includes('fetch')) {
        title = 'Network Error';
        message = 'Unable to connect to the server. Please check your connection.';
      } else if (error.message.includes('auth')) {
        title = 'Authentication Error';
        message = 'Please sign in to continue.';
      } else if (error.message.includes('permission')) {
        title = 'Permission Error';
        message = 'You don\'t have permission to perform this action.';
      }
    }

    toast({
      title,
      description: message,
      variant: 'destructive',
    });

    // Log to monitoring service
    if (typeof window !== 'undefined') {
      const errorData = {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context: details?.context,
        code: details?.code,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      console.error('Error logged to monitoring:', errorData);
    }
  }, [toast]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    details?: ErrorDetails
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, details);
      throw error;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};
