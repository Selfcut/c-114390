
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { QuoteComment } from '@/lib/quotes/types';
import { formatDistanceToNow } from 'date-fns';

interface QuoteCommentsProps {
  quoteId: string;
  updateQuoteCommentCount: (increment: boolean) => void;
}

export const QuoteComments: React.FC<QuoteCommentsProps> = ({ quoteId, updateQuoteCommentCount }) => {
  const [comments, setComments] = useState<QuoteComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [quoteId]);

  // Fix the transformation of comments data
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('quote_comments')
        .select(`
          *,
          profiles:user_id (id, name, username, avatar_url, status)
        `)
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      // Transform the data to include user information correctly
      const formattedComments: QuoteComment[] = data.map(comment => {
        // Fix: First check if profiles exists and has the expected shape
        const profilesData = comment.profiles;
        
        // Fix all TypeScript null issues by proper null checking and type assertion
        // Define default values to use when profilesData or its properties are null
        const userProfile = profilesData && typeof profilesData === 'object' 
          ? {
              id: (profilesData as any)?.id || 'unknown',
              name: (profilesData as any)?.name || 'Unknown',
              username: (profilesData as any)?.username || 'unknown',
              avatar_url: (profilesData as any)?.avatar_url || null,
              status: (profilesData as any)?.status || 'offline'
            }
          : null;
        
        return {
          id: comment.id,
          content: comment.content,
          quote_id: comment.quote_id,
          user_id: comment.user_id,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          user: userProfile
        };
      });

      setComments(formattedComments);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the addComment function with consistent RPC call
  const addComment = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from('quote_comments')
        .insert({
          content,
          quote_id: quoteId,
          user_id: user.id
        })
        .select('*, profiles:user_id(*)');

      if (error) {
        console.error('Error adding comment:', error);
        return;
      }

      if (data && data[0]) {
        // Create a properly formatted comment object
        const newComment: QuoteComment = {
          id: data[0].id,
          content: data[0].content,
          quote_id: data[0].quote_id,
          user_id: data[0].user_id,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at,
          user: {
            id: user.id,
            name: user.name ?? 'Unknown',
            username: user.username ?? 'unknown',
            avatar_url: user.avatar_url ?? null,
            status: user.status ?? 'online'
          }
        };

        // Add to comment list
        setComments(prevComments => [...prevComments, newComment]);
        
        // Update quote comment count with consistent function name
        await supabase.rpc('increment_counter_fn', {
          row_id: quoteId,
          column_name: 'comments',
          table_name: 'quotes'
        });

        // Call the callback to update the comment count in the parent component
        updateQuoteCommentCount(true);
        
        // Clear input
        setNewComment('');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-semibold">Comments</h4>
      {isLoading ? (
        <div>Loading comments...</div>
      ) : (
        <div className="space-y-2">
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user?.avatar_url ?? undefined} alt={comment.user?.name ?? "Unknown"} />
                <AvatarFallback>{(comment.user?.name ?? "U").charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="text-sm font-medium">{comment.user?.name ?? "Unknown User"}</div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet</p>}
        </div>
      )}
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={() => addComment(newComment)} disabled={isSubmitting}>
          Post
        </Button>
      </div>
    </div>
  );
};
