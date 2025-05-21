
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface UpvoteButtonProps {
  count: number;
  onUpvote: (e: React.MouseEvent) => Promise<void>;
  hasUpvoted?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'default';
  variant?: 'ghost' | 'outline' | 'default';
}

export const UpvoteButton: React.FC<UpvoteButtonProps> = ({
  count,
  onUpvote,
  hasUpvoted = false,
  disabled = false,
  size = 'default',
  variant = 'ghost'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAuthenticated = !!user;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upvote",
        variant: "destructive",
      });
      return;
    }

    try {
      await onUpvote(e);
    } catch (error) {
      console.error('Error upvoting:', error);
      toast({
        title: "Error",
        description: "Failed to upvote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            className={`flex items-center gap-1 transition-all duration-200 ${hasUpvoted ? 'text-primary' : ''}`}
            onClick={handleClick}
            disabled={disabled}
            aria-label={hasUpvoted ? "Remove upvote" : "Upvote this post"}
            aria-pressed={hasUpvoted}
          >
            <ThumbsUp 
              size={size === 'sm' ? 14 : 16} 
              className={`transition-transform ${hasUpvoted ? 'fill-primary scale-110' : 'scale-100'}`} 
            />
            <span>{count}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {hasUpvoted 
            ? 'You upvoted this' 
            : isAuthenticated 
              ? 'Upvote this post' 
              : 'Sign in to upvote'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
