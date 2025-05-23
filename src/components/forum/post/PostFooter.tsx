
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Eye, MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserInteraction } from '@/contexts/UserInteractionContext';
import { useAuth } from '@/lib/auth';
import { getContentKey } from '@/hooks/content-interactions/contentTypeUtils';

interface PostFooterProps {
  post: {
    id: string;
    upvotes: number;
    views: number;
    comments: number;
  };
  isAuthenticated?: boolean;
  onUpvote?: () => Promise<void>;
}

export const PostFooter: React.FC<PostFooterProps> = ({ 
  post, 
  isAuthenticated = false,
  onUpvote 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    likedItems,
    bookmarkedItems,
    isLoading,
    likeContent,
    bookmarkContent
  } = useUserInteraction();

  // Use consistent content key generation
  const contentKey = getContentKey(post.id, 'forum');
  const isLiked = likedItems[contentKey] || false;
  const isBookmarked = bookmarkedItems[contentKey] || false;

  // Handle like with optional custom onUpvote handler
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upvote",
        variant: "destructive",
      });
      return;
    }

    if (onUpvote) {
      await onUpvote();
    } else if (isAuthenticated && user?.id) {
      await likeContent(post.id, 'forum');
    }
  };

  // Handle bookmark
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark",
        variant: "destructive",
      });
      return;
    }

    if (user?.id) {
      await bookmarkContent(post.id, 'forum');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this forum post',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          description: 'Link copied to clipboard!',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="px-6 py-4 border-t flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-1">
          <Eye size={16} className="text-muted-foreground" />
          <span>{post.views || 0} views</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare size={16} className="text-muted-foreground" />
          <span>{post.comments || 0} comments</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${isLiked ? 'text-primary' : ''}`}
          onClick={handleLike}
          disabled={isLoading || !isAuthenticated}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <ThumbsUp size={16} className={isLiked ? 'fill-primary' : ''} />
          <span>{post.upvotes}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${isBookmarked ? 'text-primary' : ''}`}
          onClick={handleBookmark}
          disabled={isLoading || !isAuthenticated}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark size={16} className={isBookmarked ? 'fill-primary' : ''} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleShare}
          aria-label="Share"
        >
          <Share2 size={16} />
        </Button>
      </div>
    </div>
  );
};
