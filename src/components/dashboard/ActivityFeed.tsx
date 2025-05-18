
import React, { useEffect, useState } from 'react';
import { MessageSquare, BookOpen, Heart, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActivityItem {
  id: string;
  type: 'comment' | 'like' | 'bookmark' | 'view';
  title: string;
  timestamp: string;
  link?: string;
}

interface ActivityFeedProps {
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 5 }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Fetch user activities from Supabase
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) {
          console.error('Error fetching activities:', error);
          return;
        }
        
        // Transform the activities into the ActivityItem format
        const transformedActivities: ActivityItem[] = data.map(activity => {
          // Convert the activity to the correct format based on event_type
          let type: 'comment' | 'like' | 'bookmark' | 'view' = 'view';
          let title = '';
          let link = undefined;
          
          // Format the activity based on its type
          switch (activity.event_type) {
            case 'comment':
              type = 'comment';
              title = activity.metadata.title 
                ? `Commented on "${activity.metadata.title}"`
                : "Added a new comment";
              link = activity.metadata.link;
              break;
            case 'like':
              type = 'like';
              title = activity.metadata.title
                ? `Liked "${activity.metadata.title}"`
                : "Liked content";
              link = activity.metadata.link;
              break;
            case 'bookmark':
              type = 'bookmark';
              title = activity.metadata.title
                ? `Bookmarked "${activity.metadata.title}"`
                : "Bookmarked content";
              link = activity.metadata.link;
              break;
            case 'view':
              type = 'view';
              title = activity.metadata.title
                ? `Viewed "${activity.metadata.title}"`
                : activity.metadata.section
                  ? `Viewed ${activity.metadata.section}`
                  : "Viewed content";
              link = activity.metadata.link;
              break;
            default:
              title = activity.event_type.charAt(0).toUpperCase() + activity.event_type.slice(1);
          }
          
          // Calculate relative time
          const timestamp = formatRelativeTime(new Date(activity.created_at));
          
          return {
            id: activity.id,
            type,
            title,
            timestamp,
            link
          };
        });
        
        setActivities(transformedActivities);
      } catch (err) {
        console.error('Error in fetchUserActivities:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserActivities();
    
    // Refresh activities every 5 minutes
    const refreshInterval = setInterval(fetchUserActivities, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [user, limit]);
  
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'like':
        return <Heart size={16} className="text-red-500" />;
      case 'bookmark':
        return <BookOpen size={16} className="text-yellow-500" />;
      case 'view':
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };
  
  const handleActivityClick = (activity: ActivityItem) => {
    if (!activity.link) {
      toast({
        title: "No Link Available",
        description: "This activity does not have a direct link.",
      });
      return;
    }
    
    window.location.href = activity.link;
  };

  const loadMoreActivities = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit * 2);
        
      if (error) {
        console.error('Error loading more activities:', error);
        return;
      }
      
      // Transform the activities
      const transformedActivities: ActivityItem[] = data.map(activity => {
        // Similar transformation as above
        // (Abbreviated for brevity - same logic as in fetchUserActivities)
        let type: 'comment' | 'like' | 'bookmark' | 'view' = 'view';
        let title = activity.event_type;
        
        if (activity.metadata?.title) {
          title = `${activity.event_type === 'view' ? 'Viewed' : 
            activity.event_type === 'like' ? 'Liked' :
            activity.event_type === 'bookmark' ? 'Bookmarked' :
            activity.event_type === 'comment' ? 'Commented on' : 'Interacted with'} "${activity.metadata.title}"`;
        }
        
        const timestamp = formatRelativeTime(new Date(activity.created_at));
        
        return {
          id: activity.id,
          type: activity.event_type as any,
          title,
          timestamp,
          link: activity.metadata?.link
        };
      });
      
      setActivities(transformedActivities);
    } catch (err) {
      console.error('Error loading more activities:', err);
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
      {!user ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">Sign in to view your activity</p>
          <Button variant="secondary" size="sm" asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : activities.length > 0 ? (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li 
              key={activity.id} 
              className="flex items-center gap-3 hover:bg-accent/40 p-2 rounded-md transition-colors cursor-pointer"
              onClick={() => handleActivityClick(activity)}
            >
              {getActivityIcon(activity.type)}
              <p className="text-sm">
                {activity.title}
                <span className="text-xs text-muted-foreground ml-1">{activity.timestamp}</span>
              </p>
            </li>
          ))}
          <li className="text-center">
            <Button variant="link" size="sm" className="gap-1" onClick={loadMoreActivities}>
              <RefreshCw size={14} className="mr-1" />
              Load More
            </Button>
          </li>
        </ul>
      ) : (
        <div className="py-4 text-center">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
};
