
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export interface UserHoverCardProps {
  children: React.ReactNode;
  username: string;
  avatar?: string;
  avatarUrl?: string; // Added this to support the property name used in UserProfile.tsx
  status: "online" | "offline" | "away" | "do_not_disturb";
  displayName: string;
}

export const UserHoverCard = ({ 
  children, 
  username, 
  avatar,
  avatarUrl, // Added this property
  status,
  displayName
}: UserHoverCardProps) => {
  // Use avatarUrl as a fallback if avatar is not provided
  const avatarSrc = avatar || avatarUrl;

  // Function to determine the color of the status indicator
  const getStatusColor = (status: "online" | "offline" | "away" | "do_not_disturb") => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-500";
      case "away":
        return "bg-yellow-500";
      case "do_not_disturb":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 shadow-lg" align="end">
        <div className="h-24 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-t-md relative" />
        <div className="px-4 pb-4">
          <div className="flex items-end gap-4 -mt-10">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-background">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(status)}`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{displayName}</h4>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${status === "online" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                    status === "away" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                    status === "do_not_disturb" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    "bg-gray-500/10 text-gray-500 border-gray-500/20"}`}
                >
                  {status.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm">
              Philosopher, mathematician, and science enthusiast. Exploring the intersection of quantum physics and consciousness.
            </p>
            <div className="flex items-center pt-2 text-muted-foreground text-xs">
              <CalendarDays className="mr-1 h-3 w-3" />
              <span>Joined March 2024</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to={`/profile/${username}`} className="flex items-center justify-center">
                View Profile
              </Link>
            </Button>
            <Button asChild variant="default" size="sm" className="w-full">
              <Link to={`/chat?direct=${username}`} className="flex items-center justify-center">
                <MessageSquare className="mr-1 h-3 w-3" />
                Message
              </Link>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
