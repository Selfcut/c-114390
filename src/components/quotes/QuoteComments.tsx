
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { fetchComments, createComment, deleteComment } from '@/lib/quotes';
import { QuoteComment } from '@/lib/quotes/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserHoverCard } from '@/components/UserHoverCard';
import { SkeletonText } from '@/components/ui/skeleton';
import { Trash2 } from 'lucide-react';
import { timeSince } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface QuoteCommentsProps {
  quoteId: string;
}

export const QuoteComments: React.FC<QuoteCommentsProps> = ({ quoteId }) => {
  const [comments, setComments] = useState<QuoteComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Fetch comments for the quote
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await fetchComments(quoteId);
      setComments(fetchedComments);
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
  }, [quoteId, toast]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Listen for real-time comments
  useEffect(() => {
    const channel = supabase
      .channel(`quote_comments:${quoteId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_comments',
          filter: `quote_id=eq.${quoteId}`
        },
        (payload) => {
          // Reload comments when there's a change
          loadComments();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [quoteId, loadComments]);

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to add a comment',
        variant: 'destructive'
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: 'Empty Comment',
        description: 'Please write something before submitting',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await createComment(quoteId, newComment);
      
      if (result) {
        setNewComment('');
        toast({
          title: 'Comment Added',
          description: 'Your comment has been successfully added'
        });
        
        // Add the new comment to the list (optimistic update)
        setComments(prevComments => [result, ...prevComments]);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your comment',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      const success = await deleteComment(commentToDelete);
      
      if (success) {
        // Remove the deleted comment from the list
        setComments(prevComments => 
          prevComments.filter(comment => comment.id !== commentToDelete)
        );
        
        toast({
          title: 'Comment Deleted',
          description: 'Your comment has been successfully removed'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete the comment',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setCommentToDelete(null);
    }
  };

  return (
    <Card className="mt-6 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Comments</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Comment form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts about this quote..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="bg-muted/50 p-4 rounded-md text-center">
            <p className="text-muted-foreground">Please sign in to leave a comment</p>
          </div>
        )}
        
        {/* Comments list */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
          
          {isLoading ? (
            <div className="space-y-6">
              <SkeletonText lines={4} />
              <SkeletonText lines={3} />
              <SkeletonText lines={2} />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-md p-4">
                  <div className="flex justify-between">
                    <div className="flex items-start gap-3 mb-2">
                      <Avatar className="h-8 w-8">
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
                          <span className="font-medium cursor-pointer hover:text-foreground">
                            {comment.user?.name || 'Unknown User'}
                          </span>
                        </UserHoverCard>
                        <p className="text-xs text-muted-foreground">
                          {timeSince(new Date(comment.created_at))}
                        </p>
                      </div>
                    </div>
                    
                    {user?.id === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground"
                        onClick={() => setCommentToDelete(comment.id)}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                  
                  <div className="ml-11">
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!commentToDelete} onOpenChange={() => setCommentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteComment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
