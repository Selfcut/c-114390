import React from 'react';
import { MessageSquare, BookOpen, Badge, Heart, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface ActivityItemProps {
  type: 'comment' | 'like' | 'bookmark' | 'view';
  title: string;
  timestamp: string;
  link?: string;
}

const mockActivityData: ActivityItemProps[] = [
  {
    type: 'comment',
    title: 'New comment on "The Meaning of Life"',
    timestamp: '2 minutes ago',
    link: '/forum/meaning-of-life'
  },
  {
    type: 'like',
    title: 'Liked your quote on Stoicism',
    timestamp: '15 minutes ago',
    link: '/quotes/stoicism'
  },
  {
    type: 'bookmark',
    title: 'Bookmarked the article "Quantum Physics Explained"',
    timestamp: '30 minutes ago',
    link: '/library/quantum-physics'
  },
  {
    type: 'view',
    title: 'Viewed the "Artificial Intelligence Ethics" wiki page',
    timestamp: '1 hour ago',
    link: '/wiki/ai-ethics'
  },
  {
    type: 'comment',
    title: 'Replied to your discussion on "The Future of Education"',
    timestamp: '2 hours ago',
    link: '/forum/future-of-education'
  },
  {
    type: 'like',
    title: 'Liked your post on Systems Thinking',
    timestamp: '4 hours ago',
    link: '/media/systems-thinking'
  },
  {
    type: 'bookmark',
    title: 'Bookmarked the quote by Seneca',
    timestamp: '6 hours ago',
    link: '/quotes/seneca'
  },
  {
    type: 'view',
    title: 'Explored the "History of Philosophy" section',
    timestamp: '10 hours ago',
    link: '/library/history-of-philosophy'
  }
];

interface ActivityFeedProps {
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 5 }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const displayedActivities = mockActivityData.slice(0, limit);
  
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
  
  const handleActivityClick = (activity: ActivityItemProps) => {
    if (!activity.link) {
      toast({
        title: "No Link Available",
        description: "This activity does not have a direct link.",
      });
      return;
    }
    
    window.location.href = activity.link;
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
      {isAuthenticated ? (
        <ul className="space-y-3">
          {displayedActivities.map((activity, index) => (
            <li 
              key={index} 
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
            <Button variant="link" size="sm" className="gap-1">
              <RefreshCw size={14} className="mr-1" />
              Load More
            </Button>
          </li>
        </ul>
      ) : (
        <div className="text-center py-6">
          <p className="text-muted-foreground">Sign in to view your activity</p>
          <Button variant="secondary" size="sm" asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      )}
    </div>
  );
};
