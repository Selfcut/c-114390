
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen, MessageSquare, Award, Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setActivities(data || []);
    } catch (err: any) {
      console.error("Error fetching user activities:", err);
      setError(err.message || "Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
      case 'update':
        return <RefreshCw className="h-4 w-4" />;
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
        if (metadata?.section === 'profile') {
          return `Viewed ${metadata.profile || 'a profile'}`;
        }
        return `Viewed ${metadata?.section || 'content'}`;
      case 'update':
        if (metadata?.section === 'profile') {
          return `Updated profile (${metadata.fields || 'details'})`;
        }
        return `Updated ${metadata?.section || 'content'}`;
      case 'create':
        return `Created ${metadata?.type || 'content'}`;
      case 'comment':
        return `Commented on ${metadata?.section || 'content'}`;
      case 'like':
        return `Liked ${metadata?.section || 'content'}`;
      default:
        return `Activity: ${event_type}`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Recent Activity</span>
            <Skeleton className="h-8 w-8" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchActivities} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Recent Activity</span>
          <Button variant="ghost" size="sm" onClick={fetchActivities}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-none">
                <div className="bg-muted rounded-full p-2 mt-1">
                  {getActivityIcon(activity.event_type)}
                </div>
                <div>
                  <p className="text-sm">{getActivityDescription(activity)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
