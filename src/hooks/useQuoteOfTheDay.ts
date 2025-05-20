
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
        const today = new Date().toISOString().split('T')[0];
        
        // Try to get a quote specifically selected for today first
        const { data: featuredQuotes, error: featuredError } = await supabase
          .from('quotes')
          .select(`
            id,
            text,
            author,
            source,
            category,
            tags,
            likes,
            comments,
            bookmarks,
            created_at,
            user_id,
            user:profiles (id, username, name, avatar_url, status)
          `)
          .eq('featured_date', today)
          .limit(1);
        
        if (featuredError) {
          console.error('Error fetching featured quote:', featuredError);
        }
        
        // Process featured quote if available
        if (featuredQuotes && featuredQuotes.length > 0) {
          const quoteData = featuredQuotes[0];
          const processedQuote = processQuoteData(quoteData);
          
          setQuote(processedQuote);
          
          if (processedQuote.id) {
            trackQuoteView(processedQuote.id);
          }
          setIsLoading(false);
          return;
        }
        
        // Get a random popular quote (with more likes)
        const { data: popularQuotes, error: popularError } = await supabase
          .from('quotes')
          .select(`
            id,
            text,
            author, 
            source,
            category,
            tags,
            likes,
            comments,
            bookmarks,
            created_at,
            user_id,
            user:profiles (id, username, name, avatar_url, status)
          `)
          .gt('likes', 0)
          .order('likes', { ascending: false })
          .limit(10);
        
        if (popularError) {
          console.error('Error fetching popular quotes:', popularError);
        }
            
        // Process popular quotes if available
        if (popularQuotes && popularQuotes.length > 0) {
          // Pick a random quote from the popular ones
          const randomIndex = Math.floor(Math.random() * popularQuotes.length);
          const quoteData = popularQuotes[randomIndex];
          
          const processedQuote = processQuoteData(quoteData);
          setQuote(processedQuote);
          
          if (processedQuote.id) {
            trackQuoteView(processedQuote.id);
          }
          setIsLoading(false);
          return;
        }
        
        // As a last resort, get any random quote
        const { data: randomQuotes, error: randomError } = await supabase
          .from('quotes')
          .select(`
            id,
            text,
            author,
            source,
            category,
            tags,
            likes,
            comments,
            bookmarks,
            created_at,
            user_id,
            user:profiles (id, username, name, avatar_url, status)
          `)
          .limit(5)
          .order('created_at', { ascending: false });
        
        if (randomError) {
          console.error('Error fetching random quote:', randomError);
        }
                
        // Process random quote if available
        if (randomQuotes && randomQuotes.length > 0) {
          // Pick one random quote from the results
          const randomIndex = Math.floor(Math.random() * randomQuotes.length);
          const quoteData = randomQuotes[randomIndex];
          
          const processedQuote = processQuoteData(quoteData);
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
function processQuoteData(rawQuote: any): QuoteWithUser {
  if (!rawQuote) {
    return {
      id: '',
      text: '',
      author: '',
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
  
  // Process user data
  const userData = rawQuote.user || {};
  const user = {
    id: typeof userData.id === 'string' ? userData.id : '',
    username: typeof userData.username === 'string' ? userData.username : 'unknown',
    name: typeof userData.name === 'string' ? userData.name : 'Unknown User',
    avatar_url: userData.avatar_url || null,
    status: typeof userData.status === 'string' ? userData.status : 'offline'
  };
  
  // Return the processed quote
  return {
    id: rawQuote.id || '',
    text: rawQuote.text || '',
    author: rawQuote.author || '',
    source: rawQuote.source || null,
    tags: Array.isArray(rawQuote.tags) ? rawQuote.tags : [],
    likes: typeof rawQuote.likes === 'number' ? rawQuote.likes : 0,
    comments: typeof rawQuote.comments === 'number' ? rawQuote.comments : 0,
    bookmarks: typeof rawQuote.bookmarks === 'number' ? rawQuote.bookmarks : 0,
    created_at: rawQuote.created_at || new Date().toISOString(),
    user_id: rawQuote.user_id || '',
    user: user
  };
}
