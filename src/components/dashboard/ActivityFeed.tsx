
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Book, Award, Star, Heart, Eye, Bookmark, Edit, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "../ui/badge";

interface Activity {
  id: string;
  user_id: string;
  event_type: string;
  metadata: any;
  created_at: string;
  user?: {
    name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface ActivityFeedProps {
  userActivities?: Activity[];
  isLoading?: boolean;
}

export const ActivityFeed = ({ userActivities = [], isLoading = false }: ActivityFeedProps) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    // If userActivities are provided, use them
    if (userActivities.length > 0) {
      setActivities(userActivities);
      setLoading(false);
      return;
    }

    // Otherwise fetch from Supabase
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // First get the activities
        const { data: activitiesData, error } = await supabase
          .from('user_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching activities:', error);
          return;
        }

        if (!activitiesData || activitiesData.length === 0) {
          setActivities([]);
          setLoading(false);
          return;
        }

        // Then fetch user data for each activity separately
        const activitiesWithUsers = await Promise.all(
          activitiesData.map(async (activity) => {
            if (!activity.user_id) return activity;
            
            // Get user data for each activity
            const { data: userData } = await supabase
              .from('profiles')
              .select('name, username, avatar_url')
              .eq('id', activity.user_id)
              .single();
              
            return {
              ...activity,
              user: userData || { name: 'Unknown User', username: 'unknown' }
            };
          })
        );
        
        setActivities(activitiesWithUsers);
      } catch (error) {
        console.error('Error in activity feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userActivities]);

  // Get the right icon for the activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={16} className="mr-2" />;
      case 'read':
        return <Book size={16} className="mr-2" />;
      case 'achievement':
        return <Award size={16} className="mr-2" />;
      case 'bookmark':
        return <Bookmark size={16} className="mr-2" />;
      case 'like':
        return <Heart size={16} className="mr-2 text-red-500" />;
      case 'view':
        return <Eye size={16} className="mr-2" />;
      case 'edit':
        return <Edit size={16} className="mr-2" />;
      default:
        return <Star size={16} className="mr-2" />;
    }
  };

  // Format the activity message based on type and metadata
  const getActivityMessage = (activity: Activity) => {
    const { event_type, metadata } = activity;
    const username = activity.user?.name || activity.user?.username || "A user";
    
    switch (event_type) {
      case 'comment':
        return <><span className="font-medium">{username}</span> commented on <span className="text-primary">{metadata?.title || "a post"}</span></>;
      case 'like':
        return <><span className="font-medium">{username}</span> liked <span className="text-primary">{metadata?.title || "a post"}</span></>;
      case 'bookmark':
        return <><span className="font-medium">{username}</span> bookmarked <span className="text-primary">{metadata?.title || "a resource"}</span></>;
      case 'achievement':
        return <><span className="font-medium">{username}</span> earned the <Badge variant="outline" className="ml-1 mr-1">{metadata?.name || "achievement"}</Badge> badge</>;
      case 'read':
        return <><span className="font-medium">{username}</span> read <span className="text-primary">{metadata?.title || "an article"}</span></>;
      case 'quote_created':
        return <><span className="font-medium">{username}</span> shared a new quote: <span className="italic">"{metadata?.text?.substring(0, 50)}..."</span></>;
      case 'quote_liked':
        return <><span className="font-medium">{username}</span> liked a quote by <span className="text-primary">{metadata?.author || "an author"}</span></>;
      default:
        return <><span className="font-medium">{username}</span> performed an action</>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start pb-4 border-b last:border-b-0">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage 
                      src={activity.user?.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${activity.user?.username || activity.user_id}`} 
                    />
                    <AvatarFallback>
                      {(activity.user?.name || activity.user?.username || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center text-sm">
                      {getActivityIcon(activity.event_type)}
                      <p>{getActivityMessage(activity)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View all activity
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
