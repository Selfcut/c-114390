
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
            const newQuote = payload.new as any;
            // Make sure we have the required fields for QuoteWithUser type
            const quoteWithUser: QuoteWithUser = {
              id: newQuote.id,
              text: newQuote.text,
              author: newQuote.author,
              created_at: newQuote.created_at,
              category: newQuote.category || 'General', // Provide a default category
              user_id: newQuote.user_id,
              tags: Array.isArray(newQuote.tags) ? newQuote.tags : [], // Ensure tags is always an array
              likes: newQuote.likes || 0,
              comments: newQuote.comments || 0,
              bookmarks: newQuote.bookmarks || 0,
              source: newQuote.source || '',
              updated_at: newQuote.updated_at,
              featured_date: newQuote.featured_date,
              user: {
                id: 'pending', // This will be updated later when we get user details
                username: 'pending',
                name: 'User',
                avatar_url: '',
                status: 'offline'
              }
            };
            addNewQuote(quoteWithUser);
          } else if (payload.eventType === 'UPDATE') {
            const updatedQuote = payload.new as any;
            // Transform to QuoteWithUser type
            const quoteWithUser: QuoteWithUser = {
              ...updatedQuote,
              tags: Array.isArray(updatedQuote.tags) ? updatedQuote.tags : [], // Ensure tags is always an array
              likes: updatedQuote.likes || 0,
              comments: updatedQuote.comments || 0,
              bookmarks: updatedQuote.bookmarks || 0,
              source: updatedQuote.source || '',
              user: quotes.find(q => q.id === updatedQuote.id)?.user || {
                id: 'pending',
                username: 'pending',
                name: 'User',
                avatar_url: '',
                status: 'offline'
              }
            };
            updateExistingQuote(quoteWithUser);
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
          user:profiles(id, name, username, avatar_url, status)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Transform the data to match the QuoteWithUser type
      const quotesWithUser: QuoteWithUser[] = (data || []).map(quote => {
        // Check if user is a valid object and not an error
        const userProfile = typeof quote.user === 'object' && quote.user !== null 
          ? quote.user 
          : {
              id: 'unknown',
              username: 'unknown',
              name: 'Unknown User',
              avatar_url: '',
              status: 'offline'
            };
        
        return {
          ...quote,
          tags: Array.isArray(quote.tags) ? quote.tags : [], // Ensure tags is always an array
          likes: quote.likes || 0,
          comments: quote.comments || 0,
          bookmarks: quote.bookmarks || 0,
          source: quote.source || '',
          user: {
            id: userProfile.id || 'unknown',
            username: userProfile.username || 'unknown',
            name: userProfile.name || 'Unknown User',
            avatar_url: userProfile.avatar_url || '',
            status: userProfile.status || 'offline'
          }
        };
      });
      
      setQuotes(quotesWithUser);
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
