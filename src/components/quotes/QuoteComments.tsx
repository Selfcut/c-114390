
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { QuoteComment } from '@/lib/quotes/types';
import { fetchComments, createComment, deleteComment, subscribeToQuoteUpdates } from '@/lib/quotes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UserHoverCard } from '@/components/UserHoverCard';
import { Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface QuoteCommentsProps {
  quoteId: string;
}

export const QuoteComments: React.FC<QuoteCommentsProps> = ({ quoteId }) => {
  const [comments, setComments] = useState<QuoteComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Fetch comments when component mounts
  const loadComments = async () => {
    setIsLoading(true);
    try {
      const commentData = await fetchComments(quoteId);
      setComments(commentData);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [quoteId]);

  // Subscribe to comment updates using Supabase realtime
  useEffect(() => {
    const unsubscribe = subscribeToQuoteUpdates(quoteId, (payload) => {
      // If the quote's comment count changed, refresh comments
      if (payload.new && payload.new.comments !== payload.old?.comments) {
        loadComments();
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [quoteId]);

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to add comments',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newComment = await createComment(quoteId, commentText);
      if (newComment) {
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
        toast({
          title: 'Comment Added',
          description: 'Your comment has been added successfully'
        });
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add your comment',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: string) => {
    try {
      const success = await deleteComment(commentId, quoteId);
      if (success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        toast({
          title: 'Comment Deleted',
          description: 'Your comment has been deleted successfully'
        });
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete your comment',
        variant: 'destructive'
      });
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      {/* Comment form */}
      {isAuthenticated && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="mb-2 min-h-[100px]"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!commentText.trim() || isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      )}
      
      {/* Login prompt if not authenticated */}
      {!isAuthenticated && (
        <Card className="bg-muted p-4 text-center mb-6">
          <p className="mb-2">Please log in to add comments</p>
          <Button>Log In</Button>
        </Card>
      )}
      
      {/* Comments list */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : comments.length === 0 ? (
          // Empty state
          <div className="text-center py-8 text-muted-foreground">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          // Actual comments
          comments.map(comment => (
            <Card key={comment.id} className="p-4">
              <div className="flex justify-between">
                <div className="flex items-center mb-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={comment.user?.avatar_url || undefined} />
                    <AvatarFallback>{comment.user?.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <UserHoverCard
                      username={comment.user?.username || ''}
                      displayName={comment.user?.name || ''}
                      avatar={comment.user?.avatar_url || ''}
                      isOnline={comment.user?.status === 'online'}
                    >
                      <span className="font-medium text-sm">{comment.user?.name || 'Unknown User'}</span>
                    </UserHoverCard>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
                  </div>
                </div>
                
                {/* Delete button (only visible to comment author) */}
                {user?.id === comment.user_id && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <div className="ml-10">
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Skeleton loader for comments
const CommentSkeleton: React.FC = () => (
  <Card className="p-4">
    <div className="flex items-center mb-3">
      <Skeleton className="h-8 w-8 rounded-full mr-2" />
      <div>
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <div className="ml-10">
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </Card>
);
