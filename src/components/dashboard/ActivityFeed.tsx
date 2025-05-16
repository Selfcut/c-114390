
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth-context";
import { Eye, Plus, Edit, Trash, Activity } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface ActivityFeedProps {
  limit?: number;
}

export const ActivityFeed = ({ limit = 5 }: ActivityFeedProps) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) throw error;
        
        setActivities(data || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [user, limit]);
  
  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 w-full">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="space-y-2 flex-1 w-full">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <Card className="p-6 text-center w-full">
        <Activity size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No recent activity found.</p>
      </Card>
    );
  }
  
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-6 w-full">
        {activities.map((activity: any, index: number) => (
          <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 w-full">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {/* Icon based on activity type */}
              {activity.event_type === 'view' && <Eye size={14} className="text-primary" />}
              {activity.event_type === 'create' && <Plus size={14} className="text-green-500" />}
              {activity.event_type === 'update' && <Edit size={14} className="text-amber-500" />}
              {activity.event_type === 'delete' && <Trash size={14} className="text-red-500" />}
              {!['view', 'create', 'update', 'delete'].includes(activity.event_type) && 
                <Activity size={14} className="text-blue-500" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">You</span> {activity.event_type}ed{' '}
                {activity.metadata?.section || activity.metadata?.type || 'content'}
                {activity.metadata?.topic ? `: ${activity.metadata.topic}` : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
