
import React from 'react';
import { Link } from 'react-router-dom';
import { QuoteWithUser } from '@/lib/quotes/types';
import { QuoteCard } from './QuoteCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface QuotesGridProps {
  quotes: QuoteWithUser[];
  isLoading: boolean;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  onLike: (quoteId: string) => Promise<boolean | null>;
  onBookmark: (quoteId: string) => Promise<boolean | null>;
  onTagClick: (tag: string) => void;
  onResetFilters?: () => void;
}

export const QuotesGrid: React.FC<QuotesGridProps> = ({
  quotes,
  isLoading,
  userLikes,
  userBookmarks,
  onLike,
  onBookmark,
  onTagClick,
  onResetFilters
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Quotes Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          No quotes match your current filters or search criteria.
        </p>
        {onResetFilters && (
          <Button 
            variant="outline" 
            onClick={onResetFilters}
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Reset Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
      {quotes.map((quote) => (
        <Link to={`/quotes/${quote.id}`} key={quote.id} className="transition-transform hover:scale-[1.01]">
          <QuoteCard
            quote={quote}
            isLiked={userLikes[quote.id] || false}
            isBookmarked={userBookmarks[quote.id] || false}
            onLike={onLike}
            onBookmark={onBookmark}
            onTagClick={onTagClick}
          />
        </Link>
      ))}
    </div>
  );
};
