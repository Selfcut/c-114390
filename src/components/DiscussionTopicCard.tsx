
import { MessageSquare, ThumbsUp, Tag, Clock, Eye } from "lucide-react";
import { formatTimeAgo, DiscussionTopic } from "../lib/discussions-utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpvoteButton } from "./forum/UpvoteButton";
import { useForumActions } from "@/hooks/forum/useForumActions"; 
import { useAuth } from "@/lib/auth";
import { useState } from "react";

interface DiscussionTopicCardProps {
  discussion: DiscussionTopic;
  onClick?: () => void;
}

export const DiscussionTopicCard = ({ discussion, onClick }: DiscussionTopicCardProps) => {
  const { 
    title, 
    author, 
    authorId,
    authorAvatar, 
    content,
    createdAt, 
    tags, 
    upvotes, 
    views,
    isPinned,
    isPopular,
    comments,
    id
  } = discussion;

  const { user } = useAuth();
  const { handleUpvote } = useForumActions(id);
  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const [isUpvoting, setIsUpvoting] = useState(false);
  
  // Generate avatar fallback from author name if no avatar URL provided
  const getAvatarFallback = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Determine if the post is new (less than 24 hours old)
  const isNew = (() => {
    const now = new Date();
    const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  })();
  
  // Display excerpt of content
  const displayText = content ? (
    content.length > 120 ? content.slice(0, 120) + '...' : content
  ) : '';

  // Handle upvote click - update to match the expected signature
  const onUpvote = async () => {
    if (!user) return;
    setIsUpvoting(true);

    try {
      await handleUpvote(user, { id, upvotes, user_id: authorId });
      setUpvoteCount(prev => prev + 1);
    } catch (error) {
      console.error('Error upvoting:', error);
    } finally {
      setIsUpvoting(false);
    }
  };
  
  return (
    <div 
      className={`bg-card rounded-lg p-5 hover:bg-accent/20 transition-colors cursor-pointer hover-lift relative border border-border ${isPinned ? 'border-l-4 border-primary' : ''}`}
      onClick={onClick}
    >
      {isPinned && (
        <div className="absolute top-2 right-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
          Pinned
        </div>
      )}
      {isNew && !isPinned && (
        <div className="absolute top-2 right-2 bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
          New
        </div>
      )}
      {isPopular && !isPinned && !isNew && (
        <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
          Popular
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-[#00361F] flex items-center justify-center">
          <MessageSquare size={18} className="text-[#00A67E]" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-lg mb-2">{title}</h3>
          
          {displayText && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{displayText}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {tags && tags.length > 0 ? tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="flex items-center"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </Badge>
            )) : null}
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`} alt={author} />
                <AvatarFallback>{getAvatarFallback(author)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground flex items-center">
                {author}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="text-xs flex items-center gap-1">
                <Eye size={12} /> {views || 0}
              </span>
              <span className="text-xs flex items-center gap-1">
                <MessageSquare size={12} /> {comments || 0}
              </span>
              <span className="text-xs flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <UpvoteButton 
                  count={upvoteCount || 0} 
                  onUpvote={onUpvote} 
                  disabled={isUpvoting}
                  size="sm"
                />
              </span>
              <span className="text-xs flex items-center gap-1">
                <Clock size={12} /> {formatTimeAgo(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
