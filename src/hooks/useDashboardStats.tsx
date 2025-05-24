
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface DashboardStats {
  totalQuotes: number;
  totalForumPosts: number;
  totalMediaPosts: number;
  totalKnowledgeEntries: number;
  totalLikes: number;
  totalBookmarks: number;
  recentActivity: number;
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotes: 0,
    totalForumPosts: 0,
    totalMediaPosts: 0,
    totalKnowledgeEntries: 0,
    totalLikes: 0,
    totalBookmarks: 0,
    recentActivity: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch user's content counts
      const [quotesResult, forumResult, mediaResult, knowledgeResult] = await Promise.all([
        supabase.from('quotes').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('forum_posts').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('media_posts').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('knowledge_entries').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      // Fetch user's interaction counts
      const [likesResult, bookmarksResult] = await Promise.all([
        supabase.from('content_likes').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('content_bookmarks').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      // Fetch quote interactions separately
      const [quoteLikesResult, quoteBookmarksResult] = await Promise.all([
        supabase.from('quote_likes').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('quote_bookmarks').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      // Fetch recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activityResult = await supabase
        .from('user_activities')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        totalQuotes: quotesResult.count || 0,
        totalForumPosts: forumResult.count || 0,
        totalMediaPosts: mediaResult.count || 0,
        totalKnowledgeEntries: knowledgeResult.count || 0,
        totalLikes: (likesResult.count || 0) + (quoteLikesResult.count || 0),
        totalBookmarks: (bookmarksResult.count || 0) + (quoteBookmarksResult.count || 0),
        recentActivity: activityResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    isLoading,
    refreshStats: fetchStats
  };
};
