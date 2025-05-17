
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QueryOptions<T> {
  queryFn: () => Promise<{ data: T | null; error: any }>;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  defaultData?: T;
}

export function useSupabaseQuery<T>(options: QueryOptions<T>) {
  const { queryFn, onSuccess, onError, defaultData } = options;
  const [data, setData] = useState<T | null>(defaultData || null);
  const [error, setError] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: responseData, error: responseError } = await queryFn();

      if (responseError) {
        setError(responseError);
        if (onError) onError(responseError);
        else {
          toast({
            title: "Error",
            description: responseError.message || "Failed to fetch data",
            variant: "destructive",
          });
        }
      } else {
        setData(responseData);
        if (onSuccess && responseData) onSuccess(responseData);
      }
    } catch (err) {
      setError(err);
      if (onError) onError(err);
      else {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, onSuccess, onError, toast]);

  return {
    data,
    error,
    isLoading,
    execute,
    setData,
  };
}

export function useSupabaseMutation<T = any, U = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const [data, setData] = useState<T | null>(null);
  const { toast } = useToast();

  const mutate = useCallback(async <F>(
    mutationFn: (variables: U) => Promise<{ data: F | null; error: any }>,
    variables: U,
    options?: {
      onSuccess?: (data: F) => void;
      onError?: (error: any) => void;
      successMessage?: {
        title: string;
        description?: string;
      };
    }
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: responseData, error: responseError } = await mutationFn(variables);

      if (responseError) {
        setError(responseError);
        if (options?.onError) options.onError(responseError);
        else {
          toast({
            title: "Error",
            description: responseError.message || "Operation failed",
            variant: "destructive",
          });
        }
      } else {
        setData(responseData as unknown as T);
        if (options?.successMessage) {
          toast({
            title: options.successMessage.title,
            description: options.successMessage.description,
          });
        }
        if (options?.onSuccess && responseData) options.onSuccess(responseData);
      }
      
      return { data: responseData, error: responseError };
    } catch (err) {
      setError(err);
      if (options?.onError) options.onError(err);
      else {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
      
      return { data: null, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    mutate,
    isLoading,
    error,
    data,
  };
}
