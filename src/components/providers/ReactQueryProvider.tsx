
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      retry: (failureCount, error) => {
        // Only retry network errors, not 400/500 errors
        if ((error as any)?.status >= 400) return false;
        return failureCount < 2;
      },
      refetchOnMount: 'always',
    },
    mutations: {
      retry: 1,
      onError: (err) => {
        console.error('Mutation error:', err);
      },
    },
  },
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
