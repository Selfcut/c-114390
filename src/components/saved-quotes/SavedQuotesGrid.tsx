
import { QuoteWithUser } from '@/lib/quotes/types';
import { SavedQuoteCard } from './SavedQuoteCard';
import { QuoteCollection } from '@/hooks/useSavedQuotes';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface SavedQuoteWithCollection {
  quote: QuoteWithUser;
  collections: string[];
}

interface SavedQuotesGridProps {
  quotes: SavedQuoteWithCollection[];
  collections: QuoteCollection[];
  isLoading?: boolean;
  onRemoveFromCollection: (quoteId: string, collectionId: string) => Promise<boolean>;
  onAddToCollection: (quoteId: string, collectionId: string) => Promise<boolean>;
}

export function SavedQuotesGrid({
  quotes,
  collections,
  isLoading = false,
  onRemoveFromCollection,
  onAddToCollection
}: SavedQuotesGridProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (isLoading || authLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="h-48 bg-muted/30 rounded-lg animate-pulse"
            />
          ))}
        </div>
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading quotes...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
        <p className="text-muted-foreground text-center">
          Please sign in to view your saved quotes.
        </p>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-background/50">
        <h3 className="text-xl font-semibold mb-2">No Saved Quotes</h3>
        <p className="text-muted-foreground text-center mb-4">
          You haven't saved any quotes yet. Browse quotes and bookmark the ones you like.
        </p>
        <a href="/quotes" className="text-primary hover:underline">
          Browse All Quotes
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quotes.map((item) => (
        <SavedQuoteCard
          key={item.quote.id}
          quote={item.quote}
          collections={collections}
          quoteCollections={item.collections}
          onRemoveFromCollection={onRemoveFromCollection}
          onAddToCollection={onAddToCollection}
        />
      ))}
    </div>
  );
}
