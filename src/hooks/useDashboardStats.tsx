
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
  discussions_count: number;
  contributions_count: number;
  reading_list_count: number;
  events_count: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  type: string;
  description: string;
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
    recentActivity: 0,
    discussions_count: 0,
    contributions_count: 0,
    reading_list_count: 0,
    events_count: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
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

      // Fetch events count
      const eventsResult = await supabase
        .from('events')
        .select('id', { count: 'exact' })
        .gte('date', new Date().toISOString());

      // Fetch recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activityResult = await supabase
        .from('user_activities')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch recent activities for display
      const recentActivitiesResult = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const totalQuotes = quotesResult.count || 0;
      const totalForumPosts = forumResult.count || 0;
      const totalMediaPosts = mediaResult.count || 0;
      const totalKnowledgeEntries = knowledgeResult.count || 0;

      setStats({
        totalQuotes,
        totalForumPosts,
        totalMediaPosts,
        totalKnowledgeEntries,
        totalLikes: (likesResult.count || 0) + (quoteLikesResult.count || 0),
        totalBookmarks: (bookmarksResult.count || 0) + (quoteBookmarksResult.count || 0),
        recentActivity: activityResult.count || 0,
        discussions_count: totalForumPosts,
        contributions_count: totalQuotes + totalKnowledgeEntries + totalMediaPosts,
        reading_list_count: (bookmarksResult.count || 0) + (quoteBookmarksResult.count || 0),
        events_count: eventsResult.count || 0
      });

      // Transform activities for display
      const transformedActivities: Activity[] = (recentActivitiesResult.data || []).map(activity => ({
        id: activity.id,
        type: activity.event_type,
        description: getActivityDescription(activity.event_type, activity.metadata),
        created_at: activity.created_at
      }));

      setActivities(transformedActivities);

      // Mock notifications and recommendations for now
      setNotifications([
        {
          id: '1',
          title: 'Welcome!',
          message: 'Welcome to your dashboard. Start exploring!',
          created_at: new Date().toISOString(),
          read: false
        }
      ]);

      setRecommendations([
        {
          id: '1',
          title: 'Explore Philosophy',
          type: 'knowledge',
          description: 'Discover new philosophical concepts'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityDescription = (eventType: string, metadata: any) => {
    switch (eventType) {
      case 'quote_created':
        return 'Created a new quote';
      case 'forum_post_created':
        return 'Posted in the forum';
      case 'media_uploaded':
        return 'Uploaded new media';
      case 'knowledge_entry_created':
        return 'Added a knowledge entry';
      case 'comment':
        return 'Commented on content';
      case 'like':
        return 'Liked content';
      case 'bookmark':
        return 'Bookmarked content';
      default:
        return 'Recent activity';
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    activities,
    notifications,
    recommendations,
    isLoading,
    refreshStats: fetchStats
  };
};
