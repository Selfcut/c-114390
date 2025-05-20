
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Quote as QuoteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { QuoteWithUser } from '@/lib/quotes/types';
import { supabase } from '@/integrations/supabase/client';
import { useQuoteAnalytics } from '@/hooks/useQuoteAnalytics';

// Create a safer type for handling possible error responses
interface QuoteResponse {
  id: string;
  text: string;
  author: string;
  source?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  bookmarks?: number;
  created_at: string;
  user_id: string;
  category?: string;
  user: any; // We'll validate this before using it
}

export function QuoteOfTheDay() {
  const [quote, setQuote] = useState<QuoteWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
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
        if (featuredQuote && isValidQuoteWithUser(featuredQuote)) {
          setQuote(featuredQuote as QuoteWithUser);
          if (featuredQuote.id) {
            trackQuoteView(featuredQuote.id);
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
            // Find the first valid quote with user from the top 10 most liked
            const validQuote = popularQuotes.find(isValidQuoteWithUser);
            
            if (validQuote) {
              // Select a valid quote
              setQuote(validQuote as QuoteWithUser);
              if (validQuote.id) {
                trackQuoteView(validQuote.id);
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
                
              if (randomQuotes && randomQuotes.length > 0) {
                const validRandomQuote = randomQuotes.find(isValidQuoteWithUser);
                if (validRandomQuote) {
                  setQuote(validRandomQuote as QuoteWithUser);
                  if (validRandomQuote.id) {
                    trackQuoteView(validRandomQuote.id);
                  }
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
  
  // Helper function to validate quote with user
  function isValidQuoteWithUser(quote: any): quote is QuoteWithUser {
    return quote && 
      typeof quote.user === 'object' && 
      quote.user !== null &&
      !quote.user.error &&
      typeof quote.user.id === 'string' && 
      typeof quote.user.username === 'string' && 
      typeof quote.user.name === 'string';
  }
  
  if (isLoading) {
    return (
      <Card className="shadow-md border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold">Quote of the Day</h3>
          </div>
          <div className="h-24 animate-pulse bg-muted rounded-md"></div>
          <div className="mt-2 flex justify-end">
            <div className="h-4 w-24 animate-pulse bg-muted rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!quote) {
    return null;
  }
  
  return (
    <Card className="shadow-md border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold">Quote of the Day</h3>
        </div>
        <blockquote className="relative italic text-lg">
          <QuoteIcon className="h-8 w-8 absolute -top-4 -left-2 text-primary/10" />
          <p className="pl-4">{quote.text}</p>
        </blockquote>
        <footer className="mt-2 text-right">
          <cite className="font-medium">{quote.author}</cite>
          {quote.source && (
            <p className="text-xs text-muted-foreground">{quote.source}</p>
          )}
        </footer>
      </CardContent>
      <CardFooter className="border-t px-6 py-3 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/quotes/${quote.id}`)}
        >
          View Quote
        </Button>
      </CardFooter>
    </Card>
  );
}
