
import React from 'react';
import { Link } from 'react-router-dom';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, Star, Brain, CalendarDays } from "lucide-react";

interface UserHoverCardProps {
  username: string;
  children: React.ReactNode;
  userData?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    role?: string;
    bio?: string;
    badges?: string[];
    level?: number;
    iq?: number;
    joinedDate?: string;
    isOnline?: boolean;
    status?: 'online' | 'offline' | 'away' | 'do_not_disturb';
    isFollowing?: boolean;
  };
  showBio?: boolean;
}

export const UserHoverCard: React.FC<UserHoverCardProps> = ({
  username,
  children,
  userData,
  showBio = true,
}) => {
  // If no user data is provided, use the username to fetch mock data
  const user = userData || {
    id: `user-${username}`,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    username: username.toLowerCase(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    role: "Member",
    bio: "Polymath community member exploring various disciplines and contributing to discussions.",
    badges: ["Active Member"],
    level: 3,
    iq: 120,
    joinedDate: "Joined March 2025",
    isOnline: Math.random() > 0.5,
    status: 'online' as const,
    isFollowing: false,
  };

  // Get status indicator color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-400";
    
    switch (status) {
      case 'online': return "bg-green-500";
      case 'offline': return "bg-gray-400";
      case 'away': return "bg-yellow-500";
      case 'do_not_disturb': return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-primary hover:underline">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center">
              <h4 className="text-sm font-semibold">{user.name}</h4>
              {user.status && (
                <span 
                  className={`ml-1.5 h-2 w-2 rounded-full ${getStatusColor(user.status)}`}
                  title={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                ></span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                Level {user.level}
              </Badge>
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
                <Brain size={10} className="mr-1" />
                IQ {user.iq}
              </Badge>
            </div>
          </div>
        </div>
        
        {showBio && user.bio && (
          <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
            {user.bio}
          </p>
        )}
        
        <div className="flex items-center pt-2 mt-3 border-t">
          <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
          <span className="text-xs text-muted-foreground">
            {user.joinedDate}
          </span>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button asChild size="sm" className="w-full gap-1">
            <Link to={`/messages/${user.username}`}>
              <MessageSquare size={14} />
              <span>Message</span>
            </Link>
          </Button>
          
          <Button variant={user.isFollowing ? "outline" : "secondary"} size="sm" className="w-full gap-1">
            <UserPlus size={14} />
            <span>{user.isFollowing ? 'Following' : 'Follow'}</span>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
