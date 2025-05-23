
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string | null;
  authorId: string;
  content: string;
  createdAt: Date;
  upvotes: number;
}

interface UseCommentsOptions {
  problemId: number;
  enabled?: boolean;
}

export function useComments({ problemId, enabled = true }: UseCommentsOptions) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchComments = useCallback(async () => {
    if (!enabled || !problemId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      // Don't show loading state on refresh, just use isRefreshing
      if (!isRefreshing) {
        setIsLoading(true);
      }
      
      // Get forum posts that are specifically about this problem
      // Using correct PostgreSQL array containment syntax
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          tags,
          upvotes,
          created_at,
          user_id
        `)
        .filter('tags', 'cs', `{Problem ${problemId}}`) // Using the contains syntax (cs)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        setComments([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }
      
      // Fetch profiles separately for better type safety
      const userIds = data.map(post => post.user_id);
      
      if (userIds.length === 0) {
        setComments([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      // Get profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue with partial data rather than failing completely
      }
      
      // Create a map of user_id to profile data for easy lookup
      const profilesMap = (profilesData || []).reduce((acc: Record<string, any>, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
      
      // Format the comments with profile data from the map
      const formattedComments: Comment[] = data.map(post => {
        const profile = profilesMap[post.user_id] || {};
        
        return {
          id: post.id,
          content: post.content,
          author: profile.name || profile.username || 'Unknown User',
          authorAvatar: profile.avatar_url,
          authorId: post.user_id,
          createdAt: new Date(post.created_at),
          upvotes: post.upvotes || 0
        };
      });
      
      setComments(formattedComments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching comments';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error fetching comments:', err);
      
      // Only show toast if it's not just a refresh
      if (!isRefreshing) {
        toast({
          title: "Error loading comments",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [problemId, enabled, toast, isRefreshing]);
  
  useEffect(() => {
    fetchComments();
    
    // Set up real-time updates for comments
    let commentsChannel: RealtimeChannel | null = null;
    
    if (enabled && problemId) {
      commentsChannel = supabase
        .channel(`forum-posts-${problemId}`)
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'forum_posts',
            // Use correct filter for array containment
            filter: `tags::text ilike '%Problem ${problemId}%'` 
          }, 
          (payload) => {
            console.log('Received real-time update:', payload);
            // Refresh comments when changes occur
            fetchComments();
          }
        )
        .subscribe();
    }
    
    return () => {
      if (commentsChannel) {
        supabase.removeChannel(commentsChannel);
      }
    };
  }, [problemId, enabled, fetchComments]);

  // Function to add a new comment to the list
  const addComment = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };
  
  // Function to manually refresh comments
  const refreshComments = () => {
    setIsRefreshing(true);
    fetchComments();
  };

  return {
    comments,
    isLoading,
    isRefreshing,
    error,
    addComment,
    refreshComments
  };
}
