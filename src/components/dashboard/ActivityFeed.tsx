
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserHoverCard } from "../UserHoverCard";
import { MessageSquare, Book, Trophy, Users, Calendar } from "lucide-react";

export const ActivityFeed = () => {
  // Mock activity data
  const activities = [
    {
      id: "1",
      type: "badge",
      title: "Earned the \"Knowledge Seeker\" badge",
      timestamp: "3 days ago",
      icon: <Trophy size={20} className="text-amber-500" />,
      user: {
        name: "You",
        username: "you",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        status: "online" as const
      }
    },
    {
      id: "2",
      type: "post",
      title: "Posted in \"Quantum Mechanics Forum\"",
      timestamp: "1 week ago",
      icon: <MessageSquare size={20} className="text-green-500" />,
      user: {
        name: "You",
        username: "you",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        status: "online" as const
      }
    },
    {
      id: "3",
      type: "join",
      title: "Joined \"Philosophy of Mind\" group",
      timestamp: "2 weeks ago",
      icon: <Users size={20} className="text-blue-500" />,
      user: {
        name: "You",
        username: "you",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        status: "online" as const
      }
    },
    {
      id: "4",
      type: "reading",
      title: "Started reading \"Introduction to Systems Thinking\"",
      timestamp: "2 weeks ago",
      icon: <Book size={20} className="text-purple-500" />,
      user: {
        name: "You",
        username: "you",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        status: "online" as const
      }
    },
    {
      id: "5",
      type: "event",
      title: "Registered for \"Quantum Computing Seminar\"",
      timestamp: "3 weeks ago",
      icon: <Calendar size={20} className="text-cyan-500" />,
      user: {
        name: "You",
        username: "you",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        status: "online" as const
      }
    }
  ];

  return (
    <Card className="border-gray-800">
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="space-y-0 divide-y divide-border">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <UserHoverCard
                  username={activity.user.username}
                  avatar={activity.user.avatar}
                  status={activity.user.status}
                  displayName={activity.user.name}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </UserHoverCard>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
