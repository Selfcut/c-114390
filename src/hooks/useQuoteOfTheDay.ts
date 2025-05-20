
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
          // Create a safely processed quote object
          const processedQuote = createSafeQuote(featuredQuote);
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
              // Create a safely processed quote object
              const processedQuote = createSafeQuote(validQuote);
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
                const processedQuote = createSafeQuote(randomQuotes[0]);
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

// Create a safe quote object without deep type inference issues
export function createSafeQuote(rawQuote: any): QuoteWithUser {
  // Create a clean quote object with explicit types
  const safeQuote: QuoteWithUser = {
    id: typeof rawQuote.id === 'string' ? rawQuote.id : '',
    text: typeof rawQuote.text === 'string' ? rawQuote.text : '',
    author: typeof rawQuote.author === 'string' ? rawQuote.author : '',
    source: rawQuote.source || null,
    tags: Array.isArray(rawQuote.tags) ? rawQuote.tags : [],
    likes: typeof rawQuote.likes === 'number' ? rawQuote.likes : 0,
    comments: typeof rawQuote.comments === 'number' ? rawQuote.comments : 0,
    bookmarks: typeof rawQuote.bookmarks === 'number' ? rawQuote.bookmarks : 0,
    created_at: typeof rawQuote.created_at === 'string' ? rawQuote.created_at : new Date().toISOString(),
    user_id: typeof rawQuote.user_id === 'string' ? rawQuote.user_id : '',
    // Set default user
    user: DEFAULT_USER
  };
  
  // Handle user separately with minimal nesting
  if (rawQuote.user && typeof rawQuote.user === 'object') {
    // Create a new user object with explicit properties
    safeQuote.user = {
      id: typeof rawQuote.user.id === 'string' ? rawQuote.user.id : '',
      username: typeof rawQuote.user.username === 'string' ? rawQuote.user.username : 'unknown',
      name: typeof rawQuote.user.name === 'string' ? rawQuote.user.name : 'Unknown User',
      avatar_url: rawQuote.user.avatar_url || null,
      status: typeof rawQuote.user.status === 'string' ? rawQuote.user.status : 'offline'
    };
  }
  
  return safeQuote;
}
