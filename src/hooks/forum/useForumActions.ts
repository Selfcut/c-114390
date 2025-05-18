
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Comment, ForumPost } from './useForumPost';
import { UserProfile } from '@/lib/auth/types';

export function useForumActions(postId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleUpvote = async (user: UserProfile | null, discussion: ForumPost | null) => {
    if (!user || !postId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upvote",
        variant: "destructive"
      });
      return discussion;
    }
    
    try {
      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('content_likes')
        .select()
        .eq('content_id', postId)
        .eq('content_type', 'forum')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking like status:", checkError);
        throw checkError;
      }
        
      if (existingLike) {
        toast({
          description: "You've already upvoted this post",
        });
        return discussion;
      }
      
      // Add the like
      const { error: insertError } = await supabase
        .from('content_likes')
        .insert({
          content_id: postId,
          content_type: 'forum',
          user_id: user.id
        });
        
      if (insertError) {
        console.error("Error adding like:", insertError);
        throw insertError;
      }
        
      // Increment the upvote count
      const { error: rpcError } = await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'upvotes',
        table_name: 'forum_posts'
      });
      
      if (rpcError) {
        console.error("Error incrementing upvote count:", rpcError);
        throw rpcError;
      }
      
      // Update local state
      toast({
        description: "Upvoted successfully",
      });
      
      // Return updated discussion object
      if (discussion) {
        return {
          ...discussion,
          upvotes: (discussion.upvotes || 0) + 1
        };
      }
      return discussion;
    } catch (error) {
      console.error("Error upvoting:", error);
      toast({
        title: "Error",
        description: "Failed to upvote",
        variant: "destructive"
      });
      return discussion;
    }
  };

  const handleSubmitComment = async (
    user: UserProfile | null, 
    newComment: string, 
    discussion: ForumPost | null, 
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment",
        variant: "destructive"
      });
      return discussion;
    }
    
    if (!newComment.trim() || !postId) {
      toast({
        title: "Empty Comment",
        description: "Please write something before posting",
        variant: "destructive"
      });
      return discussion;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the comment to Supabase
      const { data: commentData, error: commentError } = await supabase
        .from('content_comments')
        .insert({
          content_id: postId,
          content_type: 'forum',
          user_id: user.id,
          comment: newComment.trim()
        })
        .select()
        .single();
        
      if (commentError) throw commentError;
      
      const avatarSeed = user.username || user.id;
      
      // Create the comment object for the UI
      const newCommentObj: Comment = {
        id: commentData.id,
        content: newComment,
        author: user.username || "User",
        authorAvatar: user.avatar_url || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
        createdAt: new Date(),
        isAuthor: discussion ? user.id === discussion.authorId : false
      };
      
      // Update the UI - add to the beginning to show newest first
      setComments(prev => [newCommentObj, ...prev]);
      
      // Update comment count
      let updatedDiscussion = discussion;
      if (discussion) {
        updatedDiscussion = {
          ...discussion,
          comments: (discussion.comments || 0) + 1
        };
      }
      
      // Update the comment count in the database
      await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'comments',
        table_name: 'forum_posts'
      });
      
      toast({
        title: "Comment Posted",
        description: "Your comment has been added to the discussion",
      });

      return updatedDiscussion;
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment",
        variant: "destructive"
      });
      return discussion;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleUpvote,
    handleSubmitComment
  };
}
