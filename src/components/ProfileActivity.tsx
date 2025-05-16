
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen, MessageSquare, Award, Heart } from "lucide-react";

interface ActivityItem {
  id: string;
  event_type: string;
  created_at: string;
  metadata: any;
}

interface ProfileActivityProps {
  userId: string;
}

export const ProfileActivity = ({ userId }: ProfileActivityProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        setActivities(data || []);
      } catch (err) {
        console.error("Error fetching user activities:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [userId]);

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Helper to get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Clock className="h-4 w-4" />;
      case 'create':
        return <BookOpen className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'like':
        return <Heart className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  // Helper to get activity description
  const getActivityDescription = (activity: ActivityItem) => {
    const { event_type, metadata } = activity;
    
    switch (event_type) {
      case 'view':
        return `Viewed ${metadata.section || 'content'}`;
      case 'create':
        return `Created ${metadata.type || 'content'}`;
      case 'comment':
        return `Commented on ${metadata.target || 'content'}`;
      case 'like':
        return `Liked ${metadata.target || 'content'}`;
      default:
        return `Performed ${event_type} action`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  {getActivityIcon(activity.event_type)}
                </div>
                <div>
                  <p>{getActivityDescription(activity)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No activity yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
