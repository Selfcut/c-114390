
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user'; // Use the centralized type

interface ForumDiscussion {
  id: string;
  upvotes: number;
  user_id: string;
}

export const useForumActions = (postId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUpvote = async (user: UserProfile, discussion: ForumDiscussion) => {
    if (!postId) return;

    try {
      setIsSubmitting(true);

      // Optimistically update the local state
      // setDiscussion(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : prev);

      // Perform the upvote on the server
      const { error } = await supabase.rpc('increment_counter', {
        row_id: postId,
        column_name: 'upvotes',
        table_name: 'forum_posts'
      });

      if (error) {
        console.error('Error upvoting post:', error);
        toast({
          description: "Failed to upvote the post.",
          variant: "destructive",
        });
        // Revert the optimistic update if the server update fails
        // setDiscussion(prev => prev ? { ...prev, upvotes: prev.upvotes - 1 } : prev);
      } else {
        toast({
          description: "You upvoted the post!",
        });
      }
    } catch (error) {
      console.error('Unexpected error upvoting post:', error);
      toast({
        description: "An unexpected error occurred while upvoting.",
        variant: "destructive",
      });
      // Revert the optimistic update if an unexpected error occurs
      // setDiscussion(prev => prev ? { ...prev, upvotes: prev.upvotes - 1 } : prev);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitComment = async (user: UserProfile, comment: string, discussion: ForumDiscussion, setComments: any) => {
    if (!postId) return;

    try {
      setIsSubmitting(true);

      // Create a new comment object
      const newComment = {
        content_id: postId,
        content_type: 'forum',
        comment: comment,
        user_id: user.id,
        author_name: user.username,
        author_avatar: user.avatar_url
      };

      // Optimistically update the local state
      setComments(prevComments => [...(prevComments || []), newComment]);

      // Insert the comment into the database
      const { data, error } = await supabase
        .from('content_comments')
        .insert([
          {
            content_id: postId,
            content_type: 'forum',
            comment: comment,
            user_id: user.id
          }
        ])
        .select('*')

      if (error) {
        console.error('Error submitting comment:', error);
        toast({
          description: "Failed to submit the comment.",
          variant: "destructive",
        });
        // Revert the optimistic update if the server update fails
        setComments(prevComments => prevComments.slice(0, -1));
      } else {
        toast({
          description: "Comment submitted successfully!",
        });
      }
    } catch (error) {
      console.error('Unexpected error submitting comment:', error);
      toast({
          description: "An unexpected error occurred while submitting the comment.",
          variant: "destructive",
      });
      // Revert the optimistic update if an unexpected error occurs
      setComments(prevComments => prevComments.slice(0, -1));
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
