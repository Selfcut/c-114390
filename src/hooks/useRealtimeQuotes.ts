import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithUser } from '@/lib/quotes/types';

interface UseRealtimeQuotesResult {
  quotes: QuoteWithUser[];
  isLoading: boolean;
}

export const useRealtimeQuotes = (): UseRealtimeQuotesResult => {
  const [quotes, setQuotes] = useState<QuoteWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();

    const channel = supabase
      .channel('quotes_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes',
        },
        (payload) => {
          // Handle different realtime events
          if (payload.eventType === 'INSERT') {
            addNewQuote(payload.new);
          } else if (payload.eventType === 'UPDATE') {
            updateExistingQuote(payload.new);
          } else if (payload.eventType === 'DELETE') {
            removeQuote(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          user:user_id (id, name, username, avatar_url, status)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated function to take just the ID
  const removeQuote = (quoteId: string) => {
    setQuotes(current => current.filter(quote => quote.id !== quoteId));
  };

  const addNewQuote = (newQuote: QuoteWithUser) => {
    setQuotes(current => [newQuote, ...current]);
  };

  const updateExistingQuote = (updatedQuote: QuoteWithUser) => {
    setQuotes(current =>
      current.map(quote => (quote.id === updatedQuote.id ? updatedQuote : quote))
    );
  };

  return { quotes, isLoading };
};
