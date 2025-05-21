
import { useState, useEffect } from 'react';
import { QuoteWithUser } from '@/lib/quotes/types';
import { supabase } from '@/integrations/supabase/client';
import { useQuoteAnalytics } from '@/hooks/useQuoteAnalytics';
import { format } from 'date-fns';

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
        const today = format(new Date(), 'yyyy-MM-dd');
        
        // Try to get a quote specifically selected for today first
        const { data: featuredQuotes, error: featuredError } = await supabase
          .from('quotes')
          .select('*')
          .eq('featured_date', today)
          .limit(1);
        
        if (featuredError) {
          console.error('Error fetching featured quote:', featuredError);
          setIsLoading(false);
          return;
        }
        
        let quoteData = null;
        
        // Process featured quote if available
        if (featuredQuotes && featuredQuotes.length > 0) {
          quoteData = featuredQuotes[0];
        } else {
          // Get a random popular quote (with more likes)
          const { data: popularQuotes, error: popularError } = await supabase
            .from('quotes')
            .select('*')
            .gt('likes', 0)
            .order('likes', { ascending: false })
            .limit(10);
          
          if (popularError) {
            console.error('Error fetching popular quotes:', popularError);
          } else if (popularQuotes && popularQuotes.length > 0) {
            // Pick a random quote from the popular ones
            const randomIndex = Math.floor(Math.random() * popularQuotes.length);
            quoteData = popularQuotes[randomIndex];
          }
        }
        
        if (!quoteData) {
          // As a last resort, get any random quote
          const { data: randomQuotes, error: randomError } = await supabase
            .from('quotes')
            .select('*')
            .limit(5)
            .order('created_at', { ascending: false });
          
          if (randomError) {
            console.error('Error fetching random quote:', randomError);
          } else if (randomQuotes && randomQuotes.length > 0) {
            // Pick one random quote from the results
            const randomIndex = Math.floor(Math.random() * randomQuotes.length);
            quoteData = randomQuotes[randomIndex];
          }
        }
        
        if (quoteData) {
          // Fetch user profile separately
          const { data: userProfile, error: userError } = await supabase
            .from('profiles')
            .select('id, username, name, avatar_url, status')
            .eq('id', quoteData.user_id)
            .maybeSingle();
            
          if (userError) {
            console.error('Error fetching quote author profile:', userError);
          }
          
          const processedQuote: QuoteWithUser = {
            ...quoteData,
            user: userProfile || DEFAULT_USER
          };
          
          setQuote(processedQuote);
          
          if (processedQuote.id) {
            trackQuoteView(processedQuote.id);
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

// Process a raw quote record into a safe QuoteWithUser object
function processQuoteData(rawQuote: any, userProfile?: any): QuoteWithUser {
  if (!rawQuote) {
    return {
      id: '',
      text: '',
      author: '',
      category: '',
      source: null,
      tags: [],
      likes: 0,
      comments: 0,
      bookmarks: 0,
      created_at: new Date().toISOString(),
      user_id: '',
      user: DEFAULT_USER
    };
  }
  
  // Use provided user profile or default
  const user = userProfile || DEFAULT_USER;
  
  // Return the processed quote
  return {
    id: rawQuote.id || '',
    text: rawQuote.text || '',
    author: rawQuote.author || '',
    source: rawQuote.source || null,
    category: rawQuote.category || '',
    tags: Array.isArray(rawQuote.tags) ? rawQuote.tags : [],
    likes: typeof rawQuote.likes === 'number' ? rawQuote.likes : 0,
    comments: typeof rawQuote.comments === 'number' ? rawQuote.comments : 0,
    bookmarks: typeof rawQuote.bookmarks === 'number' ? rawQuote.bookmarks : 0,
    created_at: rawQuote.created_at || new Date().toISOString(),
    featured_date: rawQuote.featured_date || null,
    user_id: rawQuote.user_id || '',
    user: user
  };
}
