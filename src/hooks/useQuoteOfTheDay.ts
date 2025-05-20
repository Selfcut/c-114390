
import { useState, useEffect } from 'react';
import { QuoteWithUser } from '@/lib/quotes/types';
import { supabase } from '@/integrations/supabase/client';
import { useQuoteAnalytics } from '@/hooks/useQuoteAnalytics';

// Define a default user object to use when user data is invalid
export const DEFAULT_USER = {
  id: '',
  username: 'unknown',
  name: 'Unknown User',
  avatar_url: null,
  status: 'offline'
};

export function useQuoteOfTheDay() {
  const [quote, setQuote] = useState<QuoteWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { trackQuoteView } = useQuoteAnalytics();
  
  useEffect(() => {
    const fetchQuoteOfTheDay = async () => {
      setIsLoading(true);
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Try to get a quote specifically selected for today first
        const { data: featuredQuote } = await supabase
          .from('quotes')
          .select(`
            *,
            user:profiles(
              id, 
              username, 
              name, 
              avatar_url, 
              status
            )
          `)
          .eq('featured_date', today)
          .maybeSingle();
        
        // If no quote is featured for today, get a random popular one
        if (featuredQuote && isValidQuote(featuredQuote)) {
          // Ensure user data is properly formatted
          const safeQuote = sanitizeQuoteUser(featuredQuote);
          setQuote(safeQuote);
          
          if (safeQuote.id) {
            trackQuoteView(safeQuote.id);
          }
        } else {
          // Get a random popular quote (with more likes)
          const { data: popularQuotes } = await supabase
            .from('quotes')
            .select(`
              *,
              user:profiles(
                id, 
                username, 
                name, 
                avatar_url, 
                status
              )
            `)
            .gt('likes', 0)
            .order('likes', { ascending: false })
            .limit(10);
            
          if (popularQuotes && popularQuotes.length > 0) {
            // Find the first valid quote from the top 10 most liked
            const validQuote = popularQuotes.find(isValidQuote);
            
            if (validQuote) {
              // Ensure user data is properly formatted
              const safeQuote = sanitizeQuoteUser(validQuote);
              setQuote(safeQuote);
              
              if (safeQuote.id) {
                trackQuoteView(safeQuote.id);
              }
            } else {
              // Get any random quote as fallback
              const { data: randomQuotes } = await supabase
                .from('quotes')
                .select(`
                  *,
                  user:profiles(
                    id, 
                    username, 
                    name, 
                    avatar_url, 
                    status
                  )
                `)
                .limit(1)
                .order('created_at', { ascending: false });
                
              if (randomQuotes && randomQuotes.length > 0 && isValidQuote(randomQuotes[0])) {
                const safeQuote = sanitizeQuoteUser(randomQuotes[0]);
                setQuote(safeQuote);
                
                if (safeQuote.id) {
                  trackQuoteView(safeQuote.id);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching quote of the day:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuoteOfTheDay();
  }, [trackQuoteView]);
  
  return {
    quote,
    isLoading
  };
}

// Helper function to validate quotes
export function isValidQuote(quote: any): boolean {
  return quote && 
    typeof quote.id === 'string' && 
    typeof quote.text === 'string' && 
    typeof quote.author === 'string';
}

// Helper function to sanitize user data in a quote
export function sanitizeQuoteUser(quote: any): QuoteWithUser {
  // Create a safe copy of the quote
  const safeQuote = { ...quote };
  
  // Check if user property exists and has valid data
  if (
    typeof quote.user !== 'object' || 
    quote.user === null || 
    quote.user.error || 
    typeof quote.user.username !== 'string' ||
    typeof quote.user.name !== 'string'
  ) {
    // Replace with default user data if invalid
    safeQuote.user = DEFAULT_USER;
  }
  
  return safeQuote as QuoteWithUser;
}
