
import React from "react";
import { Users, MessageSquare, Award, Book, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserHoverCard } from "../UserHoverCard";
import { Card, CardContent } from "@/components/ui/card";

export const CommunityActivity = () => {
  // Mock community activity
  const activities = [
    {
      id: "1",
      type: "joined_group",
      user: {
        id: "user1",
        name: "Alex Morgan",
        username: "alexmorgan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        status: "online" as const
      },
      target: "Quantum Physics Discussion Group",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: "2",
      type: "created_discussion",
      user: {
        id: "user2",
        name: "Samantha Lee",
        username: "samlee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
        status: "offline" as const
      },
      target: "The Nature of Consciousness",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: "3",
      type: "earned_badge",
      user: {
        id: "user3",
        name: "Marcus Chen",
        username: "marcuschen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        status: "away" as const
      },
      target: "Knowledge Seeker",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
    },
    {
      id: "4",
      type: "shared_resource",
      user: {
        id: "user4",
        name: "Priya Sharma",
        username: "priyasharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        status: "online" as const
      },
      target: "Introduction to Systems Thinking",
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000) // 10 hours ago
    },
    {
      id: "5",
      type: "rated_content",
      user: {
        id: "user5",
        name: "David Wilson",
        username: "davidwilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        status: "do_not_disturb" as const
      },
      target: "Epistemology in the Age of Information",
      rating: 5,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    }
  ];

  // Show empty state if no activities
  if (activities.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Community Activity</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Stay connected with the latest discussions, contributions, and activities from the community.
          </p>
          <Button 
            className="bg-[#6E59A5] hover:bg-[#7E69B5] text-white px-4 py-2 rounded-md transition-colors hover-lift"
          >
            View Activity Feed
          </Button>
        </div>
      </div>
    );
  }

  // Format time ago string
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "joined_group":
        return <Users className="h-8 w-8 text-blue-500" />;
      case "created_discussion":
        return <MessageSquare className="h-8 w-8 text-green-500" />;
      case "earned_badge":
        return <Award className="h-8 w-8 text-amber-500" />;
      case "shared_resource":
        return <Book className="h-8 w-8 text-violet-500" />;
      case "rated_content":
        return <Star className="h-8 w-8 text-yellow-500" />;
      default:
        return <MessageSquare className="h-8 w-8 text-gray-500" />;
    }
  };

  // Get description based on activity type
  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case "joined_group":
        return (
          <>
            joined <span className="font-medium text-foreground">{activity.target}</span>
          </>
        );
      case "created_discussion":
        return (
          <>
            started a discussion: <span className="font-medium text-foreground">{activity.target}</span>
          </>
        );
      case "earned_badge":
        return (
          <>
            earned the <span className="font-medium text-foreground">{activity.target}</span> badge
          </>
        );
      case "shared_resource":
        return (
          <>
            shared <span className="font-medium text-foreground">{activity.target}</span>
          </>
        );
      case "rated_content":
        return (
          <>
            gave {activity.rating} stars to <span className="font-medium text-foreground">{activity.target}</span>
          </>
        );
      default:
        return <span>{activity.target}</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="border-gray-800">
        <CardContent className="p-0">
          <div className="space-y-0 divide-y divide-border">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0">
                  <UserHoverCard
                    username={activity.user.username}
                    avatar={activity.user.avatar}
                    status={activity.user.status}
                    displayName={activity.user.name}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </UserHoverCard>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-medium">
                      {activity.user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {getActivityDescription(activity)}
                  </p>
                </div>
                
                <div className="flex-shrink-0 self-center p-2 rounded-full bg-muted/50">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 text-center border-t">
            <Button variant="outline" className="w-full">
              View More Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
