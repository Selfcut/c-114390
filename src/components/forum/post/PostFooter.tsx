
import React from 'react';
import { useUserContentInteractions } from '@/hooks/useUserContentInteractions';
import { Button } from '@/components/ui/button';
import { Bookmark, Eye, MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostFooterProps {
  post: {
    id: string;
    upvotes: number;
    views: number;
    comments: number;
  };
  isAuthenticated?: boolean; // Added isAuthenticated prop
}

export const PostFooter: React.FC<PostFooterProps> = ({ post, isAuthenticated = false }) => {
  const { 
    isLiked, 
    isBookmarked, 
    likeCount, 
    isSubmitting, 
    toggleLike, 
    toggleBookmark 
  } = useUserContentInteractions({
    contentId: post.id,
    contentType: 'forum',
    initialLikeCount: post.upvotes
  });
  
  const { toast } = useToast();

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
          onClick={toggleLike}
          disabled={isSubmitting || !isAuthenticated}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <ThumbsUp size={16} className={isLiked ? 'fill-primary' : ''} />
          <span>{likeCount}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${isBookmarked ? 'text-primary' : ''}`}
          onClick={toggleBookmark}
          disabled={isSubmitting || !isAuthenticated}
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
