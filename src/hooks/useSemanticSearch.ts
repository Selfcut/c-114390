
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SemanticSearchOptions {
  contentType: 'research' | 'wiki' | 'books';
  threshold?: number;
  limit?: number;
}

interface SearchResult<T> {
  results: T[];
  isLoading: boolean;
  error: string | null;
  performSearch: (query: string) => Promise<void>;
}

export function useSemanticSearch<T>(options: SemanticSearchOptions): SearchResult<T> {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query,
          contentType: options.contentType,
          threshold: options.threshold || 0.7,
          limit: options.limit || 10
        }
      });
      
      if (error) throw new Error(error.message);
      
      setResults(data.results || []);
    } catch (err: any) {
      console.error('Semantic search error:', err);
      setError(err.message || 'Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    results,
    isLoading,
    error,
    performSearch
  };
}
