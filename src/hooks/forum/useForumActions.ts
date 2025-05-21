
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';

export interface ForumDiscussion {
  id: string;
  upvotes?: number;
  user_id?: string;
}

export const useForumActions = (discussionId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle upvoting a post
  const handleUpvote = async (currentUser: UserProfile, discussion: ForumDiscussion): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      // Check if user has already upvoted
      const { data: existingLike } = await supabase
        .from('content_likes')
        .select('*')
        .eq('content_id', discussion.id)
        .eq('user_id', currentUser.id)
        .eq('content_type', 'forum')
        .maybeSingle();

      if (existingLike) {
        // User has already liked, remove the like
        await supabase
          .from('content_likes')
          .delete()
          .eq('content_id', discussion.id)
          .eq('user_id', currentUser.id)
          .eq('content_type', 'forum');

        // Decrement the upvote count
        await supabase
          .from('forum_posts')
          .update({ upvotes: Math.max((discussion.upvotes || 0) - 1, 0) })
          .eq('id', discussion.id);

        return true;
      } else {
        // User hasn't liked yet, add a new like
        await supabase.from('content_likes').insert([
          {
            content_id: discussion.id,
            user_id: currentUser.id,
            content_type: 'forum'
          }
        ]);

        // Increment the upvote count
        await supabase
          .from('forum_posts')
          .update({ upvotes: (discussion.upvotes || 0) + 1 })
          .eq('id', discussion.id);

        return true;
      }
    } catch (error: any) {
      console.error('Error toggling upvote:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your upvote.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding a comment
  const handleSubmitComment = async (
    currentUser: UserProfile,
    commentText: string,
    discussion: ForumDiscussion,
    setComments?: any
  ) => {
    if (!commentText.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // Add the comment
      const { data: commentData, error: commentError } = await supabase
        .from('content_comments')
        .insert([
          {
            content_id: discussion.id,
            user_id: currentUser.id,
            content_type: 'forum',
            comment: commentText
          }
        ])
        .select()
        .single();
        
      if (commentError) throw commentError;
      
      // Update comment count
      await supabase
        .from('forum_posts')
        .update({ comments: supabase.rpc('increment_counter', { row_id: discussion.id, column_name: 'comments', table_name: 'forum_posts' }) })
        .eq('id', discussion.id);
        
      // Format and add the new comment to state if callback provided
      if (setComments) {
        setComments((prevComments: any[]) => [
          {
            id: commentData.id,
            content: commentData.comment,
            author: currentUser.name || currentUser.username || 'You',
            authorAvatar: currentUser.avatar_url || currentUser.avatar,
            createdAt: new Date(commentData.created_at),
            isAuthor: discussion.user_id === currentUser.id
          },
          ...prevComments
        ]);
      }
      
      toast({
        description: 'Comment posted successfully!'
      });
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post your comment.',
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
