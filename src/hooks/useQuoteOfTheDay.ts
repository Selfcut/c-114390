
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

// Helper interface for the user data in Supabase response
interface UserResponse {
  id: string | null;
  username: string;
  name: string;
  avatar_url: string | null;
  status: string;
}

// Helper interface to properly type Supabase response
interface QuoteResponse {
  id: string;
  text: string;
  author: string;
  source?: string | null;
  tags?: string[];
  likes?: number;
  comments?: number;
  bookmarks?: number;
  created_at: string;
  user_id: string;
  category?: string;
  user: UserResponse | null;
}

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
        
        // Process data without complex type assertions
        if (featuredData && featuredData.length > 0 && isValidQuote(featuredData[0])) {
          const processedQuote = createSafeQuote(featuredData[0]);
          setQuote(processedQuote);
          
          if (processedQuote.id) {
            trackQuoteView(processedQuote.id);
          }
        } else {
          // Get a random popular quote (with more likes)
          const { data: popularData, error: popularError } = await supabase
            .from('quotes')
            .select('*, user:profiles(id, username, name, avatar_url, status)')
            .gt('likes', 0)
            .order('likes', { ascending: false })
            .limit(10);
            
          // Process popular quotes without complex type assertions
          const popularQuotes = popularData || [];
          
          if (popularQuotes.length > 0) {
            // Find the first valid quote from the top 10 most liked
            const validQuote = popularQuotes.find(isValidQuote);
            
            if (validQuote) {
              const processedQuote = createSafeQuote(validQuote);
              setQuote(processedQuote);
              
              if (processedQuote.id) {
                trackQuoteView(processedQuote.id);
              }
            } else {
              // Get any random quote as fallback
              const { data: randomData, error: randomError } = await supabase
                .from('quotes')
                .select('*, user:profiles(id, username, name, avatar_url, status)')
                .limit(1)
                .order('created_at', { ascending: false });
                
              // Process random quote without complex type assertions
              const randomQuote = randomData && randomData.length > 0 ? randomData[0] : null;
              
              if (randomQuote && isValidQuote(randomQuote)) {
                const processedQuote = createSafeQuote(randomQuote);
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
  // Explicitly create a new object with typed properties to avoid deep type inference
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
    user: DEFAULT_USER // Set default user first
  };
  
  // Handle user data separately to avoid deep type inference issues
  if (rawQuote.user && typeof rawQuote.user === 'object') {
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
