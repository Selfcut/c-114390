
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export interface UserStats {
  discussions_count: number;
  contributions_count: number;
  reading_list_count: number;
  events_count: number;
  streak: number;
  karma: number;
  completed_challenges: number;
}

export interface UserActivity {
  id: string;
  description: string;
  type: string;
  created_at: string;
}

export interface Notification {
  id: string;
  message: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  link: string;
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    discussions_count: 0,
    contributions_count: 0,
    reading_list_count: 0,
    events_count: 0,
    streak: 0,
    karma: 0,
    completed_challenges: 0
  });
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        if (!user) return;
        
        // Create mock data for user_stats if the table doesn't exist
        // This is a temporary fix until the actual table is created
        const mockStats = {
          discussions_count: Math.floor(Math.random() * 15),
          contributions_count: Math.floor(Math.random() * 20),
          reading_list_count: Math.floor(Math.random() * 10),
          events_count: Math.floor(Math.random() * 5),
          streak: Math.floor(Math.random() * 30),
          karma: Math.floor(Math.random() * 100),
          completed_challenges: Math.floor(Math.random() * 10)
        };
        
        setStats(mockStats);
        
        // Create mock activities
        const mockActivities = [
          {
            id: '1',
            description: 'You commented on "The future of AI research"',
            type: 'comment',
            created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
          },
          {
            id: '2',
            description: 'You read "Introduction to Quantum Computing"',
            type: 'read',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
          },
          {
            id: '3',
            description: 'You contributed to the Physics wiki',
            type: 'contribution',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
          }
        ];
        
        setActivities(mockActivities);
        
        // Create mock notifications
        const mockNotifications = [
          {
            id: '1',
            message: 'Your post received 5 upvotes',
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
          },
          {
            id: '2',
            message: 'John Smith replied to your comment',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
          }
        ];
        
        setNotifications(mockNotifications);
        
        // Create mock recommendations
        const mockRecommendations = [
          {
            id: '1',
            title: 'The Structure of Scientific Revolutions',
            description: 'Classic book on the history of science by Thomas Kuhn',
            type: 'book',
            link: '/library'
          },
          {
            id: '2',
            title: 'Join the AI Ethics Discussion',
            description: 'Hot topic with 25+ contributors this week',
            type: 'discussion',
            link: '/forum'
          },
          {
            id: '3',
            title: 'Quantum Computing Fundamentals',
            description: 'Learn the basics of quantum computing theory',
            type: 'idea',
            link: '/wiki'
          }
        ];
        
        setRecommendations(mockRecommendations);
        
        // Eventually you'll want to replace the mock data with actual API calls like:
        // const { data: statsData } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single();
        // if (statsData) {
        //   setStats(statsData);
        // }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  return {
    isLoading,
    stats,
    activities,
    notifications,
    recommendations
  };
};
