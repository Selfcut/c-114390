
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

// Helper function to safely process quote data
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
        const { data: featuredData, error: featuredError } = await supabase
          .from('quotes')
          .select('*, user:profiles(id, username, name, avatar_url, status)')
          .eq('featured_date', today)
          .limit(1);
        
        // Process featured quote if available
        if (featuredData && featuredData.length > 0 && isQuoteDataValid(featuredData[0])) {
          const safeQuote = processSafeQuote(featuredData[0]);
          setQuote(safeQuote);
          
          if (safeQuote.id) {
            trackQuoteView(safeQuote.id);
          }
        } else {
          // Get a random popular quote (with more likes)
          const { data: popularData, error: popularError } = await supabase
            .from('quotes')
            .select('*, user:profiles(id, username, name, avatar_url, status)')
            .gt('likes', 0)
            .order('likes', { ascending: false })
            .limit(10);
            
          // Process popular quotes
          const popularQuotes = popularData || [];
          
          if (popularQuotes.length > 0) {
            // Find the first valid quote from the top 10 most liked
            const validQuote = popularQuotes.find(isQuoteDataValid);
            
            if (validQuote) {
              const safeQuote = processSafeQuote(validQuote);
              setQuote(safeQuote);
              
              if (safeQuote.id) {
                trackQuoteView(safeQuote.id);
              }
            } else {
              // Get any random quote as fallback
              const { data: randomData, error: randomError } = await supabase
                .from('quotes')
                .select('*, user:profiles(id, username, name, avatar_url, status)')
                .limit(1)
                .order('created_at', { ascending: false });
                
              // Process random quote
              const randomQuote = randomData && randomData.length > 0 ? randomData[0] : null;
              
              if (randomQuote && isQuoteDataValid(randomQuote)) {
                const safeQuote = processSafeQuote(randomQuote);
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

// Simple validation function without complex types
function isQuoteDataValid(quoteData: any): boolean {
  return quoteData && 
    typeof quoteData.id === 'string' && 
    typeof quoteData.text === 'string' && 
    typeof quoteData.author === 'string';
}

// Process raw data into a safe QuoteWithUser object
function processSafeQuote(rawData: any): QuoteWithUser {
  // Create a new object with explicit types to avoid deep inference issues
  const safeQuote: QuoteWithUser = {
    id: typeof rawData.id === 'string' ? rawData.id : '',
    text: typeof rawData.text === 'string' ? rawData.text : '',
    author: typeof rawData.author === 'string' ? rawData.author : '',
    source: rawData.source || null,
    tags: Array.isArray(rawData.tags) ? rawData.tags : [],
    likes: typeof rawData.likes === 'number' ? rawData.likes : 0,
    comments: typeof rawData.comments === 'number' ? rawData.comments : 0,
    bookmarks: typeof rawData.bookmarks === 'number' ? rawData.bookmarks : 0,
    created_at: typeof rawData.created_at === 'string' ? rawData.created_at : new Date().toISOString(),
    user_id: typeof rawData.user_id === 'string' ? rawData.user_id : '',
    user: DEFAULT_USER // Set default user first
  };
  
  // Handle user data separately to avoid deep type inference issues
  if (rawData.user && typeof rawData.user === 'object') {
    safeQuote.user = {
      id: typeof rawData.user.id === 'string' ? rawData.user.id : '',
      username: typeof rawData.user.username === 'string' ? rawData.user.username : 'unknown',
      name: typeof rawData.user.name === 'string' ? rawData.user.name : 'Unknown User',
      avatar_url: rawData.user.avatar_url || null,
      status: typeof rawData.user.status === 'string' ? rawData.user.status : 'offline'
    };
  }
  
  return safeQuote;
}
