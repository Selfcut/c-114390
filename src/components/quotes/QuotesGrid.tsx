
import React from 'react';
import { Link } from 'react-router-dom';
import { QuoteWithUser } from '@/lib/quotes';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface QuotesGridProps {
  quotes: QuoteWithUser[];
  isLoading: boolean;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  onLike: (id: string) => Promise<boolean | null>;
  onBookmark: (id: string) => Promise<boolean | null>;
  onTagClick: (tag: string) => void;
  onResetFilters: () => void;
}

export const QuotesGrid = ({
  quotes,
  isLoading,
  userLikes,
  userBookmarks,
  onLike,
  onBookmark,
  onTagClick,
  onResetFilters
}: QuotesGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border rounded-lg overflow-hidden">
            <div className="p-5">
              <Skeleton className="h-24 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="p-4 bg-muted/30 border-t">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg text-center mt-6">
        <h3 className="text-xl font-medium mb-2">No quotes found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
        <Button onClick={onResetFilters} variant="outline" className="flex items-center gap-2">
          <RefreshCw size={16} />
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {quotes.map((quote) => (
        <Link 
          to={`/quotes/${quote.id}`} 
          key={quote.id}
          className="bg-card border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-md group"
        >
          <div className="p-5">
            <p className="text-lg font-serif italic relative line-clamp-4 mb-4">
              <span className="absolute -left-3 -top-1 text-2xl text-primary/30">"</span>
              {quote.text}
              <span className="absolute text-2xl text-primary/30">"</span>
            </p>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{quote.author}</p>
                {quote.source && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{quote.source}</p>
                )}
              </div>
              <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                {quote.category || "Other"}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-t group-hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill={userLikes[quote.id] ? "currentColor" : "none"}
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={userLikes[quote.id] ? "text-red-500" : "text-muted-foreground"}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {quote.likes || 0}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {quote.comments || 0}
              </span>
            </div>
            <span className="flex items-center gap-1 text-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={userBookmarks[quote.id] ? "currentColor" : "none"} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={userBookmarks[quote.id] ? "text-primary" : "text-muted-foreground"}
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              {quote.bookmarks || 0}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
