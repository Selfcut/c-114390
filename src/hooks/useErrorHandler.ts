
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorContext {
  context?: string;
  action?: string;
  retry?: () => void;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context?: ErrorContext) => {
    console.error(`Error in ${context?.context || 'unknown context'}:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    toast.error(message, {
      action: context?.retry ? {
        label: 'Retry',
        onClick: context.retry
      } : undefined
    });
  }, []);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context?: ErrorContext
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};
