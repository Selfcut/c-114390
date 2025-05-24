
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
}

export const QuoteOfTheDay: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuoteOfTheDay = async () => {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('id, text, author, source')
          .eq('featured_date', new Date().toISOString().split('T')[0])
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching quote of the day:', error);
        }

        if (data) {
          setQuote(data);
        } else {
          // Fallback to a random quote if no featured quote for today
          const { data: randomQuote, error: randomError } = await supabase
            .from('quotes')
            .select('id, text, author, source')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (!randomError && randomQuote) {
            setQuote(randomQuote);
          }
        }
      } catch (error) {
        console.error('Error fetching quote of the day:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuoteOfTheDay();
  }, []);

  if (isLoading || !quote) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Star className="h-5 w-5 text-yellow-500" />
          Quote of the Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-lg font-medium italic text-blue-800 dark:text-blue-200 mb-3">
          "{quote.text}"
        </blockquote>
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-medium">— {quote.author}</span>
          {quote.source && <span>, {quote.source}</span>}
        </div>
      </CardContent>
    </Card>
  );
};
