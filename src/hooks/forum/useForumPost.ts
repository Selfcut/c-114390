
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  isAuthor: boolean;
}

interface ForumPost {
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

export function useForumPost(postId?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [discussion, setDiscussion] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  const fetchDiscussion = useCallback(async () => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch the forum post with proper join to profiles table
      const { data: postData, error: postError } = await supabase
        .from('forum_posts')
        .select(`
          id, title, content, tags, upvotes, views, comments, is_pinned,
          created_at, user_id,
          profiles:user_id (name, username, avatar_url)
        `)
        .eq('id', postId)
        .single();
        
      if (postError) {
        console.error("Error fetching forum post:", postError);
        setIsLoading(false);
        return;
      }
      
      if (!postData) {
        setIsLoading(false);
        return;
      }

      // Process the data
      const authorInfo = postData.profiles || {};
      // Safely access properties that might not exist
      const authorName = (authorInfo as any)?.name || (authorInfo as any)?.username || 'Unknown User';
      const authorAvatar = (authorInfo as any)?.avatar_url || 
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
      
      setDiscussion(processedPost);
      
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('content_comments')
        .select(`
          id, comment, user_id, created_at,
          profiles:user_id (name, username, avatar_url)
        `)
        .eq('content_id', postId)
        .eq('content_type', 'forum')
        .order('created_at', { ascending: false });
        
      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
      } else if (commentsData) {
        // Process comments
        const processedComments: Comment[] = commentsData.map(comment => {
          const commentAuthorInfo = comment.profiles || {};
          // Safely access properties that might not exist
          const commentAuthorName = (commentAuthorInfo as any)?.name || (commentAuthorInfo as any)?.username || 'Unknown User';
          const commentAuthorAvatar = (commentAuthorInfo as any)?.avatar_url || 
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${commentAuthorName}`;
            
          return {
            id: comment.id,
            content: comment.comment,
            author: commentAuthorName,
            authorAvatar: commentAuthorAvatar,
            createdAt: new Date(comment.created_at),
            isAuthor: comment.user_id === postData.user_id
          };
        });
        
        setComments(processedComments);
      }
      
      // Update view count
      try {
        await supabase.rpc('increment_counter_fn', {
          row_id: postId,
          column_name: 'views',
          table_name: 'forum_posts'
        });
      } catch (err) {
        console.error('Error incrementing view count:', err);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error in fetchDiscussion:", error);
      toast({
        title: "Error",
        description: "Failed to load discussion",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [postId, toast]);

  useEffect(() => {
    fetchDiscussion();
  }, [fetchDiscussion]);

  return {
    isLoading,
    discussion,
    comments,
    setComments
  };
}

export type { Comment, ForumPost };
