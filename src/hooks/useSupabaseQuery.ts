
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Type for Supabase query function
type SupabaseQueryFn<T> = () => Promise<PostgrestSingleResponse<T>>;

// Type for Supabase mutation function
type SupabaseMutationFn<TData, TVariables> = (variables: TVariables) => Promise<PostgrestSingleResponse<TData>>;

/**
 * Custom hook for Supabase queries with React Query integration
 */
export function useSupabaseQuery<TData = unknown, TError = Error>(
  queryKey: string[],
  queryFn: SupabaseQueryFn<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, string[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await queryFn();
      if (error) throw error;
      return data as TData;
    },
    ...options,
  });
}

/**
 * Custom hook for Supabase mutations with React Query integration
 */
export function useSupabaseMutation<TData = unknown, TVariables = unknown, TError = Error>(
  mutationFn: SupabaseMutationFn<TData, TVariables>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  const { toast } = useToast();
  
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      const { data, error } = await mutationFn(variables);
      if (error) throw error;
      return data as TData;
    },
    onSuccess: (data, variables, context) => {
      // Show success toast if not suppressed
      if (!options?.meta?.suppressSuccessToast) {
        toast({
          title: options?.meta?.successTitle || 'Success',
          description: options?.meta?.successMessage || 'Operation completed successfully',
        });
      }
      
      // Call original onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}

/**
 * Custom hook for paginated Supabase queries with React Query integration
 */
export function usePaginatedSupabaseQuery<TData = unknown, TError = Error>(
  queryKey: string[],
  fetchItems: (page: number, pageSize: number) => Promise<PostgrestResponse<TData>>,
  pageSize: number = 10,
  options?: Omit<UseQueryOptions<{
    items: TData[];
    count: number;
  }, TError, {
    items: TData[];
    count: number;
  }, string[]>, 'queryKey' | 'queryFn'>
) {
  const [page, setPage] = useState(0);

  const query = useQuery<{
    items: TData[];
    count: number;
  }, TError>({
    queryKey: [...queryKey, page.toString(), pageSize.toString()],
    queryFn: async () => {
      const { data, error, count } = await fetchItems(page, pageSize);
      if (error) throw error;
      return {
        items: data || [],
        count: count || 0
      };
    },
    ...options,
  });

  return {
    ...query,
    page,
    setPage,
    pageSize,
    pageCount: Math.ceil((query.data?.count || 0) / pageSize),
  };
}
