
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image_url: string;
  isbn: string;
  published_year: number;
  genre: string;
}

export function useBookSearch() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchBooks = async (query: string) => {
    if (!query || query.length < 2) {
      setBooks([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(10);
      
      if (error) throw new Error(error.message);
      
      setBooks(data || []);
    } catch (err: any) {
      console.error('Error searching books:', err);
      setError(err.message || 'Failed to search books');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBookById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err: any) {
      console.error('Error fetching book:', err);
      setError(err.message || 'Failed to fetch book');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    books,
    isLoading,
    error,
    searchBooks,
    getBookById
  };
}
