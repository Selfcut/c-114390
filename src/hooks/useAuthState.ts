
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useErrorHandler } from './useErrorHandler';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
}

export const useAuthState = () => {
  const { user, session, isLoading } = useAuth();
  const { handleError } = useErrorHandler();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  useEffect(() => {
    try {
      setAuthState({
        isAuthenticated: !!user && !!session,
        isLoading,
        user,
        error: null
      });
    } catch (error) {
      handleError(error, { context: 'auth-state-update' });
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to update authentication state',
        isLoading: false
      }));
    }
  }, [user, session, isLoading, handleError]);

  const requireAuth = (callback: () => void, errorMessage?: string) => {
    if (!authState.isAuthenticated) {
      handleError(new Error(errorMessage || 'Authentication required'), {
        context: 'require-auth'
      });
      return false;
    }
    callback();
    return true;
  };

  return {
    ...authState,
    requireAuth
  };
};
