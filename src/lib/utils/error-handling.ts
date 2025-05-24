
import { useToast } from '@/hooks/use-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', field);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed') {
    super(message, 'NETWORK_ERROR', undefined, true);
    this.name = 'NetworkError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export const errorHandler = {
  handleError: (error: unknown, context?: string) => {
    console.error(`Error in ${context}:`, error);
    
    if (error instanceof AppError) {
      return {
        message: error.message,
        code: error.code,
        retryable: error.retryable
      };
    }
    
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
        retryable: false
      };
    }
    
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      retryable: false
    };
  },

  createErrorHandler: (context: string) => (error: unknown) => {
    return errorHandler.handleError(error, context);
  }
};

// Global error boundary utility
export const withErrorBoundary = <T extends any[]>(
  fn: (...args: T) => Promise<any>,
  context: string
) => {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      const handled = errorHandler.handleError(error, context);
      throw new AppError(handled.message, handled.code, context, handled.retryable);
    }
  };
};
