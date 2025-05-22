
import { useState, useEffect, useMemo } from 'react';
import { useQuotes } from './useQuotes';
import { QuoteWithUser, QuoteFilterOptions } from '@/lib/quotes/types';

export function useQuotesCache(initialOptions?: QuoteFilterOptions) {
  // Use the existing quotes hook
  const quotesData = useQuotes(initialOptions);
  const { quotes } = quotesData;
  
  // Local cache for quotes to prevent unnecessary renders
  const [cachedQuotes, setCachedQuotes] = useState<Record<string, QuoteWithUser>>({});
  
  // Update cache when quotes change
  useEffect(() => {
    if (quotes.length > 0) {
      const newCache: Record<string, QuoteWithUser> = { ...cachedQuotes };
      quotes.forEach(quote => {
        newCache[quote.id] = quote;
      });
      setCachedQuotes(newCache);
    }
  }, [quotes]);
  
  // Memoized collection of all quotes (both from current fetch and cache)
  const allQuotes = useMemo(() => {
    const currentIds = new Set(quotes.map(q => q.id));
    const cachedValues = Object.values(cachedQuotes).filter(q => !currentIds.has(q.id));
    return [...quotes, ...cachedValues];
  }, [quotes, cachedQuotes]);
  
  // Memoized functions to get individual quotes by ID
  const getQuoteById = useMemo(() => (id: string) => cachedQuotes[id], [cachedQuotes]);
  
  // Provide both the original quotes hook data and enhanced cache functionality
  return {
    ...quotesData,
    cachedQuotes,
    allQuotes,
    getQuoteById
  };
}
