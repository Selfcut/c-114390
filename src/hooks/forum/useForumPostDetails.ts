
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: Date;
  isAuthor: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: Date;
  tags: string[];
  upvotes: number;
  views: number;
  comments: number;
  isPinned: boolean;
}

export function useForumPostDetails(postId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch post details
  const {
    data: discussion,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError
  } = useQuery({
    queryKey: ['forum', 'post', postId],
    queryFn: async () => {
      if (!postId) return null;

      // Fetch the forum post
      const { data: postData, error: postError } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', postId)
        .single();
        
      if (postError) throw postError;
      if (!postData) return null;

      // Fetch author profile separately
      const { data: authorProfile } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url')
        .eq('id', postData.user_id)
        .maybeSingle();
      
      // Process the data
      const authorName = authorProfile?.name || authorProfile?.username || 'Unknown User';
      const authorAvatar = authorProfile?.avatar_url || 
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
        
      const processedPost: ForumPost = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        author: authorName,
        authorId: postData.user_id,
        authorAvatar,
        createdAt: new Date(postData.created_at),
        tags: postData.tags || [],
        upvotes: postData.upvotes || 0,
        views: postData.views || 0,
        comments: postData.comments || 0,
        isPinned: postData.is_pinned || false
      };
      
      // Increment view count - do this in the background
      try {
        await supabase.rpc('increment_counter_fn', {
          row_id: postId,
          column_name: 'views',
          table_name: 'forum_posts'
        });
      } catch (err) {
        console.error('Error incrementing view count:', err);
      }
      
      return processedPost;
    },
    enabled: !!postId
  });

  // Fetch comments
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['forum', 'comments', postId],
    queryFn: async () => {
      if (!postId) return [];

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('content_comments')
        .select(`
          id, comment, user_id, created_at
        `)
        .eq('content_id', postId)
        .eq('content_type', 'forum')
        .order('created_at', { ascending: true });
        
      if (commentsError) throw commentsError;
      if (!commentsData || commentsData.length === 0) return [];
      
      // Fetch all comment author profiles in one batch
      const userIds = commentsData.map(comment => comment.user_id);
      const { data: commentProfiles } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url')
        .in('id', userIds);
        
      // Create profiles map
      const profilesMap: Record<string, any> = {};
      if (commentProfiles) {
        commentProfiles.forEach((profile: any) => {
          profilesMap[profile.id] = profile;
        });
      }
      
      // Process comments
      return commentsData.map(comment => {
        const profile = profilesMap[comment.user_id];
        const commentAuthorName = profile?.name || profile?.username || 'Unknown User';
        const commentAuthorAvatar = profile?.avatar_url || 
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${commentAuthorName}`;
          
        return {
          id: comment.id,
          content: comment.comment,
          author: commentAuthorName,
          authorId: comment.user_id,
          authorAvatar: commentAuthorAvatar,
          createdAt: new Date(comment.created_at),
          isAuthor: discussion && comment.user_id === discussion.authorId
        };
      });
    },
    enabled: !!postId && !!discussion
  });

  // Add a new comment
  const addComment = useCallback(async (content: string, userId: string) => {
    if (!postId || !content.trim() || !userId) return false;
    
    try {
      // Insert the comment
      const { data: commentData, error } = await supabase
        .from('content_comments')
        .insert({
          content_id: postId,
          content_type: 'forum',
          user_id: userId,
          comment: content.trim()
        })
        .select();
      
      if (error) throw error;
      
      // Update comment count
      await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'comments',
        table_name: 'forum_posts'
      });
      
      // Refetch comments
      await refetchComments();
      
      // Update the post cache with incremented comment count
      queryClient.setQueryData(['forum', 'post', postId], (oldData: ForumPost | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          comments: (oldData.comments || 0) + 1
        };
      });
      
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
      return false;
    }
  }, [postId, toast, refetchComments, queryClient]);

  // Upvote the post
  const upvotePost = useCallback(async (userId: string) => {
    if (!postId || !userId || !discussion) return false;
    
    try {
      // Optimistically update UI
      queryClient.setQueryData(['forum', 'post', postId], {
        ...discussion,
        upvotes: discussion.upvotes + 1
      });
      
      await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'upvotes',
        table_name: 'forum_posts'
      });
      
      return true;
    } catch (error) {
      console.error('Error upvoting:', error);
      
      // Revert optimistic update
      queryClient.setQueryData(['forum', 'post', postId], discussion);
      
      toast({
        title: "Error",
        description: "Failed to upvote",
        variant: "destructive"
      });
      return false;
    }
  }, [postId, discussion, queryClient, toast]);

  // Combine loading and error states
  const isLoading = isPostLoading || isCommentsLoading;
  const isError = isPostError || isCommentsError;
  const error = postError || commentsError;

  return {
    discussion,
    comments,
    isLoading,
    isError,
    error,
    addComment,
    upvotePost
  };
}
