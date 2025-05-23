
import React, { memo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string | null;
  authorId: string;
  content: string;
  createdAt: Date;
  upvotes: number;
}

interface CommentsListProps {
  comments: Comment[];
  isLoading: boolean;
  isRefreshing?: boolean;
  userAuthenticated: boolean;
  onRefresh?: () => void;
  error?: Error | null;
}

// Using memo to prevent unnecessary re-renders
export const CommentsList = memo(({ 
  comments, 
  isLoading, 
  isRefreshing = false,
  userAuthenticated,
  onRefresh,
  error 
}: CommentsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [upvotingCommentId, setUpvotingCommentId] = useState<string | null>(null);
  const [upvotedComments, setUpvotedComments] = useState<Set<string>>(new Set());
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleUpvote = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote comments",
        variant: "destructive"
      });
      return;
    }
    
    // Prevent double upvoting
    if (upvotedComments.has(commentId)) {
      toast({
        description: "You've already upvoted this comment",
      });
      return;
    }
    
    try {
      setUpvotingCommentId(commentId);
      
      // First retrieve current upvote count
      const { data: postData, error: fetchError } = await supabase
        .from('forum_posts')
        .select('upvotes')
        .eq('id', commentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Then increment the upvote count
      const newUpvoteCount = (postData?.upvotes || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('forum_posts')
        .update({ upvotes: newUpvoteCount })
        .eq('id', commentId);
      
      if (updateError) throw updateError;
      
      // Add this comment to the list of upvoted comments
      setUpvotedComments(prev => {
        const newSet = new Set(prev);
        newSet.add(commentId);
        return newSet;
      });
      
      // Update the local state
      toast({
        title: "Upvoted",
        description: "Your upvote has been recorded"
      });
    } catch (error) {
      console.error('Error upvoting comment:', error);
      toast({
        title: "Error",
        description: "Failed to record your upvote",
        variant: "destructive"
      });
    } finally {
      setUpvotingCommentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(2).fill(0).map((_, index) => (
          <Card key={`skeleton-${index}`} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-muted h-10 w-10"></div>
                <div className="flex-1">
                  <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-32 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 bg-muted rounded w-16"></div>
                    <div className="h-8 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
            <AlertCircle size={32} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h3 className="text-xl font-medium mb-2">Failed to Load Comments</h3>
        <p className="text-muted-foreground mb-4">{error.message || "An error occurred while loading comments"}</p>
        {onRefresh && (
          <Button onClick={onRefresh}>
            <RefreshCw size={16} className="mr-2" /> Try Again
          </Button>
        )}
      </Card>
    );
  }

  if (comments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-muted p-4">
            <MessageSquare size={32} className="text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-xl font-medium mb-2">No Comments Yet</h3>
        <p className="text-muted-foreground mb-4">Be the first to share your thoughts</p>
        {!userAuthenticated && (
          <Button asChild>
            <a href="/auth">Sign In to Comment</a>
          </Button>
        )}
      </Card>
    );
  }

  // Using keyed fragments for optimized list rendering
  return (
    <div className="space-y-4">
      {comments.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={item.authorAvatar || undefined} />
                <AvatarFallback>{item.author.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{item.author}</h4>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <p className="mb-4">{item.content}</p>
                <div className="flex items-center gap-4">
                  <Button 
                    variant={upvotedComments.has(item.id) ? "default" : "ghost"}
                    size="sm" 
                    className={`flex items-center gap-1 ${upvotedComments.has(item.id) ? 'bg-primary/10' : ''}`}
                    onClick={() => handleUpvote(item.id)}
                    disabled={upvotingCommentId === item.id || !userAuthenticated || upvotedComments.has(item.id)}
                    title={upvotedComments.has(item.id) ? "You've upvoted this comment" : "Upvote this comment"}
                  >
                    {upvotingCommentId === item.id ? (
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1"></span>
                    ) : (
                      <ThumbsUp size={14} className={upvotedComments.has(item.id) ? 'text-primary' : ''} />
                    )}
                    <span>{item.upvotes}</span>
                  </Button>
                  {userAuthenticated && (
                    <Button variant="ghost" size="sm">Reply</Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Show refreshing indicator at the bottom */}
      {isRefreshing && (
        <div className="flex justify-center items-center py-4">
          <RefreshCw size={16} className="animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Refreshing comments...</span>
        </div>
      )}
    </div>
  );
});

// Display name for debugging purposes
CommentsList.displayName = 'CommentsList';
