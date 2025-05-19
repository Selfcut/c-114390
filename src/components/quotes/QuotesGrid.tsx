
import React from 'react';
import { Card } from "@/components/ui/card";
import { QuoteCard } from "./QuoteCard";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteWithUser } from "@/lib/quotes-service";

interface QuotesGridProps {
  quotes: QuoteWithUser[];
  isLoading: boolean;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  onLike: (quoteId: string) => void;
  onBookmark: (quoteId: string) => void;
  onTagClick: (tag: string) => void;
  onResetFilters: () => void;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-6">
              <div className="h-4 w-12 bg-muted rounded mb-4"></div>
              <div className="h-20 bg-muted rounded mb-4"></div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-muted rounded-full mr-3"></div>
                <div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (quotes.length === 0) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <Quote size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No quotes found matching your criteria.</p>
          <Button onClick={onResetFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quotes.map(quote => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          isLiked={!!userLikes[quote.id]}
          isBookmarked={!!userBookmarks[quote.id]}
          onLike={onLike}
          onBookmark={onBookmark}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
};
