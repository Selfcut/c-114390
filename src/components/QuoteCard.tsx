
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { UserStatus } from "@/types/user";
import { useAuth } from "@/lib/auth";
import { likeQuote, bookmarkQuote, checkUserLikedQuote, checkUserBookmarkedQuote } from "@/lib/quotes-service";
import { QuoteCommentModal } from "./QuoteCommentModal";
import { toast } from "./ui/use-toast";

export interface QuoteCardProps {
  id: string;
  text: string;
  author: string;
  source: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  bookmarks?: number;
  hasLiked?: boolean;
  hasBookmarked?: boolean;
  createdAt: Date;
  user: {
    name: string;
    avatar: string;
    status: UserStatus;
  };
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onShare?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  id,
  text,
  author,
  source,
  category,
  tags,
  likes,
  comments,
  bookmarks = 0,
  hasLiked: initialLiked = false,
  hasBookmarked: initialBookmarked = false,
  createdAt,
  user,
  onLike,
  onComment,
  onBookmark,
  onShare,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLikeChecked, setIsLikeChecked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isBookmarkChecked, setIsBookmarkChecked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(bookmarks);
  const [commentCount, setCommentCount] = useState(comments);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();
  
  // Check if user has liked or bookmarked this quote
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const checkInteractions = async () => {
      if (!isLikeChecked) {
        const liked = await checkUserLikedQuote(id);
        setIsLiked(liked);
        setIsLikeChecked(true);
      }
      
      if (!isBookmarkChecked) {
        const bookmarked = await checkUserBookmarkedQuote(id);
        setIsBookmarked(bookmarked);
        setIsBookmarkChecked(true);
      }
    };
    
    checkInteractions();
  }, [id, isAuthenticated, isLikeChecked, isBookmarkChecked]);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  };

  // Get status indicator color
  const getStatusIndicator = (status: UserStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "do-not-disturb":
        return "bg-red-500";
      case "invisible":
      case "offline":
      default:
        return "bg-gray-500";
    }
  };

  // Handle like button click
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like quotes",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await likeQuote(id);
      setIsLiked(result);
      setLikeCount(prev => result ? prev + 1 : prev - 1);
      
      if (onLike) onLike(id);
    } catch (error) {
      console.error("Error liking quote:", error);
      toast({
        title: "Error",
        description: "Could not process your like. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle bookmark button click
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark quotes",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await bookmarkQuote(id);
      setIsBookmarked(result);
      setBookmarkCount(prev => result ? prev + 1 : prev - 1);
      
      if (onBookmark) onBookmark(id);
    } catch (error) {
      console.error("Error bookmarking quote:", error);
      toast({
        title: "Error",
        description: "Could not process your bookmark. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle share
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(`"${text}" - ${author}`);
      toast({
        title: "Quote copied to clipboard",
        description: "You can now share it anywhere"
      });
    }
  };
  
  // Handle comment
  const handleComment = () => {
    setIsCommentModalOpen(true);
    if (onComment) onComment(id);
  };
  
  // Handle when new comment is added
  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  return (
    <>
      <div className="bg-card border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-md group">
        <div className="p-5">
          {/* Quote text */}
          <div className="mb-4">
            <p className="text-lg font-serif italic relative">
              <span className="absolute -left-4 -top-2 text-3xl text-primary/30">"</span>
              {text}
              <span className="absolute text-3xl text-primary/30">"</span>
            </p>
          </div>
          
          {/* Quote metadata */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-sm">{author}</p>
              {source && <p className="text-xs text-muted-foreground">{source}</p>}
            </div>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {category}
            </Badge>
          </div>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs hover:bg-secondary/80 cursor-pointer">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* User info and timestamp */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-[1px] border-background ${getStatusIndicator(user.status)}`}></span>
              </div>
              <span className="text-xs font-medium">{user.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(createdAt)}</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-t group-hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 px-2 ${
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
              onClick={handleLike}
            >
              <Heart size={16} className={isLiked ? "fill-current" : ""} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2 text-muted-foreground hover:text-foreground"
              onClick={handleComment}
            >
              <MessageSquare size={16} />
              <span className="text-xs">{commentCount}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 px-2 ${
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={handleBookmark}
            >
              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              <span className="text-xs">{bookmarkCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2 text-muted-foreground hover:text-foreground"
              onClick={handleShare}
            >
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Comments modal */}
      {isCommentModalOpen && (
        <QuoteCommentModal
          quoteId={id}
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </>
  );
};
