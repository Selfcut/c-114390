
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
      // Fetch the forum post
      const { data: postData, error: postError } = await supabase
        .from('forum_posts')
        .select('*')
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

      // Fetch author profile separately to handle potential missing profiles
      const { data: authorProfile, error: authorError } = await supabase
        .from('profiles')
        .select('name, username, avatar_url')
        .eq('id', postData.user_id)
        .maybeSingle();  // Use maybeSingle instead of single to handle missing profiles
      
      // Process the data even if profile is missing
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
      
      setDiscussion(processedPost);
      
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('content_comments')
        .select(`
          id, comment, user_id, created_at
        `)
        .eq('content_id', postId)
        .eq('content_type', 'forum')
        .order('created_at', { ascending: false });
        
      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
      } else if (commentsData) {
        // Fetch all comment author profiles in one batch
        const userIds = commentsData.map(comment => comment.user_id);
        const { data: commentProfiles, error: profilesError } = await supabase
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
        const processedComments: Comment[] = commentsData.map(comment => {
          const profile = profilesMap[comment.user_id];
          // Generate a name even if profile is missing
          const commentAuthorName = profile?.name || profile?.username || 'Unknown User';
          const commentAuthorAvatar = profile?.avatar_url || 
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
