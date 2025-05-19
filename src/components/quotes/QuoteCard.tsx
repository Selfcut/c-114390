
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, Share, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserHoverCard } from "@/components/UserHoverCard";
import { QuoteWithUser } from "@/lib/quotes-service";

interface QuoteCardProps {
  quote: QuoteWithUser;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike: (quoteId: string) => void;
  onBookmark: (quoteId: string) => void;
  onTagClick?: (tag: string) => void;
  onShare?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onTagClick,
  onShare
}) => {
  // Handle actions
  const handleLike = () => onLike(quote.id);
  const handleBookmark = () => onBookmark(quote.id);
  
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share behavior
      navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    }
  };

  return (
    <Card key={quote.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-6">
          <Quote size={18} className="text-primary mb-2" />
          <p className="text-lg mb-4">{quote.text}</p>
          
          <div className="flex items-center mb-4">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={quote.user?.avatar_url} alt={quote.user?.name} />
              <AvatarFallback>{quote.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{quote.author}</div>
              {quote.source && (
                <div className="text-xs text-muted-foreground">{quote.source}</div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {quote.tags && quote.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline"
                className="hover:bg-muted cursor-pointer"
                onClick={() => onTagClick && onTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          {quote.user && (
            <div className="text-xs text-muted-foreground mb-4 flex items-center">
              <span className="mr-2">Submitted by</span>
              <UserHoverCard
                username={quote.user.username}
                displayName={quote.user.name}
                avatar={quote.user.avatar_url || ""}
                isOnline={quote.user.status === "online"}
              >
                <span className="font-medium cursor-pointer hover:text-foreground">
                  {quote.user.name}
                </span>
              </UserHoverCard>
            </div>
          )}
        </div>
        
        <div className="border-t px-6 py-3 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            className={isLiked ? "text-red-500" : ""}
            onClick={handleLike}
          >
            <Heart
              size={18} 
              className={`mr-1 ${isLiked ? "fill-red-500" : ""}`}
            />
            {quote.likes || 0}
          </Button>
          
          <div className="flex gap-1">
            <Button
              variant="ghost" 
              size="sm"
              className={isBookmarked ? "text-yellow-500" : ""}
              onClick={handleBookmark}
            >
              <Bookmark 
                size={18}
                className={isBookmarked ? "fill-yellow-500" : ""}
              />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleShare}
            >
              <Share size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
