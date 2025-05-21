import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useForumActions = (postId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUpvote = async (user: any, discussion: any) => {
    if (!user || !postId) return;

    setIsSubmitting(true);
    try {
      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('content_likes')
        .select('*')
        .eq('content_id', postId)
        .eq('user_id', user.id)
        .eq('content_type', 'forum')
        .maybeSingle();

      if (checkError) {
        console.error('Error checking like:', checkError);
        return;
      }

      if (existingLike) {
        // User already liked, so remove the like
        await supabase
          .from('content_likes')
          .delete()
          .eq('id', existingLike.id);

        // Decrement upvote count
        await supabase.rpc('decrement_counter_fn', {
          row_id: postId,
          column_name: 'upvotes',
          table_name: 'forum_posts'
        });

        toast({
          description: 'You removed your upvote from this post',
          variant: 'default'
        });
      } else {
        // Add new like
        await supabase.from('content_likes').insert({
          content_id: postId,
          user_id: user.id,
          content_type: 'forum'
        });

        // Increment upvote count
        await supabase.rpc('increment_counter_fn', {
          row_id: postId,
          column_name: 'upvotes',
          table_name: 'forum_posts'
        });

        toast({
          description: 'Post upvoted successfully',
          variant: 'default'
        });
      }
      
      // Return successful operation
      return true;
    } catch (error) {
      console.error('Error upvoting:', error);
      toast({
        title: 'Failed to upvote',
        description: 'An error occurred while processing your request.',
        variant: 'destructive'
      });
      
      // Return failed operation
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitComment = async (user: any, comment: string, discussion: any, setComments: any) => {
    if (!comment.trim() || !user || !postId) return;

    setIsSubmitting(true);
    try {
      // Add comment to database
      const { data: newComment, error: commentError } = await supabase
        .from('content_comments')
        .insert({
          content_id: postId,
          user_id: user.id,
          comment,
          content_type: 'forum'
        })
        .select()
        .single();

      if (commentError) {
        console.error('Error adding comment:', commentError);
        throw commentError;
      }

      // Increment comments count on the post
      await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'comments',
        table_name: 'forum_posts'
      });

      // Update comments list
      setComments((prev: any[]) => [...prev, { ...newComment, author_name: user.name }]);

      toast({
        description: 'Your comment has been posted',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: 'Failed to post comment',
        description: 'An error occurred while submitting your comment.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleUpvote,
    handleSubmitComment
  };
};
