
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const { toast } = useToast();
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Only show error toast if we haven't set a custom error handler
        if (!query.meta?.suppressErrorToast) {
          toast({
            title: 'Error loading data',
            description: error instanceof Error ? error.message : 'Something went wrong',
            variant: 'destructive',
          });
        }
      }
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        // Only show error toast if we haven't set a custom error handler
        if (!mutation.options.meta?.suppressErrorToast) {
          toast({
            title: 'Error performing action',
            description: error instanceof Error ? error.message : 'Something went wrong',
            variant: 'destructive',
          });
        }
      }
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: import.meta.env.MODE === 'production',
        retry: 1,
        gcTime: 5 * 60 * 1000, // 5 minutes
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.MODE === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
