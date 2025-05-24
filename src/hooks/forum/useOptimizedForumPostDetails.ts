
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { withErrorBoundary } from '@/lib/utils/error-handling';

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

const fetchForumPost = withErrorBoundary(async (postId: string): Promise<ForumPost | null> => {
  if (!postId) return null;

  const { data: postData, error: postError } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('id', postId)
    .single();
    
  if (postError) throw postError;
  if (!postData) return null;

  const { data: authorProfile } = await supabase
    .from('profiles')
    .select('id, name, username, avatar_url')
    .eq('id', postData.user_id)
    .maybeSingle();
  
  const authorName = authorProfile?.name || authorProfile?.username || 'Unknown User';
  const authorAvatar = authorProfile?.avatar_url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
    
  return {
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
}, 'fetchForumPost');

const fetchComments = withErrorBoundary(async (postId: string): Promise<Comment[]> => {
  if (!postId) return [];

  const { data: commentsData, error: commentsError } = await supabase
    .from('content_comments')
    .select('id, comment, user_id, created_at')
    .eq('content_id', postId)
    .eq('content_type', 'forum')
    .order('created_at', { ascending: true });
    
  if (commentsError) throw commentsError;
  if (!commentsData || commentsData.length === 0) return [];
  
  const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
  const { data: commentProfiles } = await supabase
    .from('profiles')
    .select('id, name, username, avatar_url')
    .in('id', userIds);
    
  const profilesMap: Record<string, any> = {};
  if (commentProfiles) {
    commentProfiles.forEach((profile: any) => {
      profilesMap[profile.id] = profile;
    });
  }
  
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
      isAuthor: false // Will be set by the hook
    };
  });
}, 'fetchComments');

export function useOptimizedForumPostDetails(postId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch post details with optimized caching
  const {
    data: discussion,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError
  } = useQuery({
    queryKey: ['forum', 'post', postId],
    queryFn: () => fetchForumPost(postId!),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch comments with optimized caching
  const {
    data: rawComments = [],
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['forum', 'comments', postId],
    queryFn: () => fetchComments(postId!),
    enabled: !!postId && !!discussion,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Memoize processed comments
  const comments = useMemo(() => {
    return rawComments.map(comment => ({
      ...comment,
      isAuthor: discussion && comment.authorId === discussion.authorId
    }));
  }, [rawComments, discussion]);

  // Optimized add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, userId }: { content: string; userId: string }) => {
      if (!postId || !content.trim() || !userId) {
        throw new Error('Missing required parameters');
      }
      
      const { data: commentData, error } = await supabase
        .from('content_comments')
        .insert({
          content_id: postId,
          content_type: 'forum',
          user_id: userId,
          comment: content.trim()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update comment count
      await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'comments',
        table_name: 'forum_posts'
      });
      
      return commentData;
    },
    onSuccess: () => {
      // Invalidate and refetch comments
      queryClient.invalidateQueries({ queryKey: ['forum', 'comments', postId] });
      
      // Update the post cache with incremented comment count
      queryClient.setQueryData(['forum', 'post', postId], (oldData: ForumPost | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          comments: (oldData.comments || 0) + 1
        };
      });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  });

  // Optimized upvote mutation
  const upvoteMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!postId || !userId || !discussion) {
        throw new Error('Missing required parameters');
      }
      
      await supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'upvotes',
        table_name: 'forum_posts'
      });
    },
    onMutate: async () => {
      // Optimistically update UI
      if (discussion) {
        queryClient.setQueryData(['forum', 'post', postId], {
          ...discussion,
          upvotes: discussion.upvotes + 1
        });
      }
    },
    onError: (error) => {
      // Revert optimistic update
      if (discussion) {
        queryClient.setQueryData(['forum', 'post', postId], discussion);
      }
      
      console.error('Error upvoting:', error);
      toast({
        title: "Error",
        description: "Failed to upvote",
        variant: "destructive"
      });
    }
  });

  // Increment view count on mount
  useEffect(() => {
    if (postId && discussion) {
      supabase.rpc('increment_counter_fn', {
        row_id: postId,
        column_name: 'views',
        table_name: 'forum_posts'
      }).catch(err => console.error('Error incrementing view count:', err));
    }
  }, [postId, discussion]);

  const addComment = useCallback(async (content: string, userId: string) => {
    try {
      await addCommentMutation.mutateAsync({ content, userId });
      return true;
    } catch (error) {
      return false;
    }
  }, [addCommentMutation]);

  const upvotePost = useCallback(async (userId: string) => {
    try {
      await upvoteMutation.mutateAsync(userId);
      return true;
    } catch (error) {
      return false;
    }
  }, [upvoteMutation]);

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
    upvotePost,
    isAddingComment: addCommentMutation.isPending,
    isUpvoting: upvoteMutation.isPending
  };
}
