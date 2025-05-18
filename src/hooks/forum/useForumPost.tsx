
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ForumComment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  author_name?: string;
  author_avatar?: string;
}

interface ForumDiscussion {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  views: number;
  upvotes: number;
  author_name?: string;
  author_avatar?: string;
}

export const useForumPost = (postId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [discussion, setDiscussion] = useState<ForumDiscussion | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);

  useEffect(() => {
    if (!postId) return;

    const fetchPostData = async () => {
      setIsLoading(true);
      try {
        // Fetch the post
        const { data: postData, error: postError } = await supabase
          .from('forum_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (postError) {
          console.error('Error fetching post:', postError);
          setIsLoading(false);
          return;
        }

        // Increment view count
        await supabase.rpc('increment_counter', {
          row_id: postId,
          column_name: 'views',
          table_name: 'forum_posts'
        });

        // Format the post data
        const formattedPost: ForumDiscussion = {
          ...postData,
          upvotes: postData.upvotes || 0,
          views: postData.views + 1 || 1
        };

        setDiscussion(formattedPost);

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('content_comments')
          .select('*')
          .eq('content_id', postId)
          .eq('content_type', 'forum')
          .order('created_at', { ascending: true });

        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
        } else {
          setComments(commentsData || []);
        }
      } catch (error) {
        console.error('Error in fetchPostData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  return {
    isLoading,
    discussion,
    comments,
    setComments
  };
};
