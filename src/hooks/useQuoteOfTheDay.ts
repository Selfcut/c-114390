
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
        
        if (featuredError) {
          console.error('Error fetching featured quote:', featuredError);
        }
        
        // Process featured quote if available
        if (featuredData && featuredData.length > 0) {
          const quoteData = featuredData[0];
          if (isValidQuote(quoteData)) {
            const safeQuote = createSafeQuote(quoteData);
            setQuote(safeQuote);
            
            if (safeQuote.id) {
              trackQuoteView(safeQuote.id);
            }
            setIsLoading(false);
            return;
          }
        }
        
        // Get a random popular quote (with more likes)
        const { data: popularData, error: popularError } = await supabase
          .from('quotes')
          .select('*, user:profiles(id, username, name, avatar_url, status)')
          .gt('likes', 0)
          .order('likes', { ascending: false })
          .limit(10);
        
        if (popularError) {
          console.error('Error fetching popular quotes:', popularError);
        }
            
        // Process popular quotes if available
        if (popularData && popularData.length > 0) {
          // Find the first valid quote from the popular quotes
          const validQuote = popularData.find(isValidQuote);
            
          if (validQuote) {
            const safeQuote = createSafeQuote(validQuote);
            setQuote(safeQuote);
            
            if (safeQuote.id) {
              trackQuoteView(safeQuote.id);
            }
            setIsLoading(false);
            return;
          }
        }
        
        // As a last resort, get any random quote
        const { data: randomData, error: randomError } = await supabase
          .from('quotes')
          .select('*, user:profiles(id, username, name, avatar_url, status)')
          .limit(1)
          .order('created_at', { ascending: false });
        
        if (randomError) {
          console.error('Error fetching random quote:', randomError);
        }
                
        // Process random quote if available
        if (randomData && randomData.length > 0) {
          const randomQuote = randomData[0];
          
          if (isValidQuote(randomQuote)) {
            const safeQuote = createSafeQuote(randomQuote);
            setQuote(safeQuote);
            
            if (safeQuote.id) {
              trackQuoteView(safeQuote.id);
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

// Simple validation function with explicit type
function isValidQuote(quoteData: any): boolean {
  return quoteData && 
    typeof quoteData.id === 'string' && 
    typeof quoteData.text === 'string' && 
    typeof quoteData.author === 'string';
}

// Create a safe QuoteWithUser object with explicit types
function createSafeQuote(rawData: any): QuoteWithUser {
  // Create base quote object with default values
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
    user: DEFAULT_USER // Set default user initially
  };
  
  // Process user data if available
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
