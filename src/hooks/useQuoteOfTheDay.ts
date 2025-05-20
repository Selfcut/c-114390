
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
        const { data: featuredQuote, error: featuredError } = await supabase
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
          // Process the quote with safe user data
          const processedQuote = processQuote(featuredQuote);
          setQuote(processedQuote);
          
          if (processedQuote.id) {
            trackQuoteView(processedQuote.id);
          }
        } else {
          // Get a random popular quote (with more likes)
          const { data: popularQuotes, error: popularError } = await supabase
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
              // Process the quote with safe user data
              const processedQuote = processQuote(validQuote);
              setQuote(processedQuote);
              
              if (processedQuote.id) {
                trackQuoteView(processedQuote.id);
              }
            } else {
              // Get any random quote as fallback
              const { data: randomQuotes, error: randomError } = await supabase
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
                const processedQuote = processQuote(randomQuotes[0]);
                setQuote(processedQuote);
                
                if (processedQuote.id) {
                  trackQuoteView(processedQuote.id);
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

// Process quote and ensure it has valid user data
export function processQuote(quote: any): QuoteWithUser {
  // Create a new object with explicit properties to avoid deep type inference issues
  const safeQuote: QuoteWithUser = {
    id: quote.id || '',
    text: quote.text || '',
    author: quote.author || '',
    source: quote.source || null,
    tags: Array.isArray(quote.tags) ? quote.tags : [],
    likes: typeof quote.likes === 'number' ? quote.likes : 0,
    comments: typeof quote.comments === 'number' ? quote.comments : 0,
    bookmarks: typeof quote.bookmarks === 'number' ? quote.bookmarks : 0,
    created_at: quote.created_at || new Date().toISOString(),
    user_id: quote.user_id || '',
    // Use type assertion to avoid excessive type checking
    user: DEFAULT_USER
  };
  
  // Handle user separately as a simple assignment to avoid deep type inference
  if (quote.user && 
      typeof quote.user === 'object' && 
      typeof quote.user.username === 'string') {
    safeQuote.user = {
      id: quote.user.id || '',
      username: quote.user.username,
      name: quote.user.name || 'Unknown User',
      avatar_url: quote.user.avatar_url || null,
      status: quote.user.status || 'offline'
    };
  }
  
  return safeQuote;
}
