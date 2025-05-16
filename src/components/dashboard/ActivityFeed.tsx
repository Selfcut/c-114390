
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/discussions-utils";
import { MessageSquare, ThumbsUp, FileText, Clock, Book, Bookmark, Lightbulb, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityItem {
  id: string;
  type: "discussion" | "comment" | "like" | "quote" | "wiki" | "document" | "achievement";
  content: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  link?: string;
}

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch activities from API
  useEffect(() => {
    // Simulate API call with delay
    const timeout = setTimeout(() => {
      // Mock data for now - would be replaced with an API call to fetch real activities
      setActivities([
        {
          id: "1",
          type: "discussion",
          content: "started a discussion: 'Exploring the relationship between quantum physics and consciousness'",
          user: {
            name: "Alex Morgan",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
          },
          timestamp: new Date(Date.now() - 25 * 60 * 1000) // 25 minutes ago
        },
        {
          id: "2",
          type: "comment",
          content: "commented on 'Mathematical models for complex adaptive systems'",
          user: {
            name: "Taylor Reed",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor"
          },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: "3",
          type: "like",
          content: "liked your comment on 'The role of metaphor in scientific discovery'",
          user: {
            name: "Jordan Chen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan"
          },
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
          id: "4",
          type: "wiki",
          content: "created a wiki article: 'An Introduction to Systems Thinking'",
          user: {
            name: "Sam Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"
          },
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
          id: "5",
          type: "quote",
          content: "shared a new quote from Richard Feynman",
          user: {
            name: "Morgan Smith",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan"
          },
          timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000) // 18 hours ago
        }
      ]);
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "discussion":
        return <MessageSquare size={16} className="text-blue-500" />;
      case "comment":
        return <MessageSquare size={16} className="text-green-500" />;
      case "like":
        return <ThumbsUp size={16} className="text-pink-500" />;
      case "quote":
        return <Bookmark size={16} className="text-purple-500" />;
      case "wiki":
        return <FileText size={16} className="text-amber-500" />;
      case "document":
        return <Book size={16} className="text-teal-500" />;
      case "achievement":
        return <Award size={16} className="text-rose-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Community Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          // Loading skeleton
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 mb-4">
              <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>{activity.user.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>
                  {" "}
                  <span className="text-muted-foreground">{activity.content}</span>
                </p>
                <div className="flex items-center text-xs text-muted-foreground gap-2">
                  <div className="flex items-center gap-1">
                    {getActivityIcon(activity.type)}
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
                      {activity.type}
                    </Badge>
                  </div>
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <Lightbulb size={40} className="text-muted-foreground mb-2 opacity-20" />
            <p className="text-muted-foreground">No recent activity to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
