
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, MessageCircle } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';

interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: string;
  tags: string[];
  likes: number;
  bookmarks: number;
  comments: number;
  created_at: string;
}

interface QuotesGridProps {
  quotes: Quote[];
  isLoading: boolean;
  userLikes: Record<string, boolean>;
  userBookmarks: Record<string, boolean>;
  onLike: (quoteId: string) => Promise<boolean | null>;
  onBookmark: (quoteId: string) => Promise<boolean | null>;
  onTagClick: (tag: string) => void;
}

export const QuotesGrid: React.FC<QuotesGridProps> = ({
  quotes,
  isLoading,
  userLikes,
  userBookmarks,
  onLike,
  onBookmark,
  onTagClick
}) => {
  if (isLoading) {
    return <LoadingScreen message="Loading quotes..." fullScreen={false} />;
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No quotes found. Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quotes.map((quote) => (
        <Card key={quote.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <blockquote className="text-lg font-medium italic mb-4 leading-relaxed">
              "{quote.text}"
            </blockquote>
            
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">— {quote.author}</span>
                {quote.source && <span className="text-muted-foreground">, {quote.source}</span>}
              </div>
              
              {quote.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {quote.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagClick(tag)}
                      className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLike(quote.id)}
                    className="flex items-center space-x-1"
                  >
                    <Heart 
                      size={16} 
                      className={userLikes[quote.id] ? "fill-red-500 text-red-500" : ""} 
                    />
                    <span>{quote.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onBookmark(quote.id)}
                    className="flex items-center space-x-1"
                  >
                    <Bookmark 
                      size={16} 
                      className={userBookmarks[quote.id] ? "fill-blue-500 text-blue-500" : ""} 
                    />
                    <span>{quote.bookmarks}</span>
                  </Button>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MessageCircle size={16} />
                    <span>{quote.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
