
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus } from "lucide-react";

export interface UserHoverCardProps {
  children: React.ReactNode;
  username: string;
  avatar?: string;
  avatarUrl?: string;
  status?: "online" | "offline" | "away" | "do_not_disturb";
  displayName: string;
  isOnline?: boolean;
  bio?: string;
  joinedDate?: string;
  mutualFriends?: number;
  mutualServers?: number;
}

export const UserHoverCard = ({ 
  children, 
  username, 
  avatar,
  avatarUrl,
  status = "offline",
  displayName,
  isOnline = false,
  bio = "No bio set",
  joinedDate = "Recently joined",
  mutualFriends = 0,
  mutualServers = 0
}: UserHoverCardProps) => {
  // Use avatarUrl as a fallback if avatar is not provided
  const avatarSrc = avatar || avatarUrl;
  
  // If isOnline is true and status is not explicitly set, use "online"
  const effectiveStatus = isOnline && status === "offline" ? "online" : status;

  // Function to determine the color of the status indicator
  const getStatusColor = (status: "online" | "offline" | "away" | "do_not_disturb") => {
    switch (status) {
      case "online":
        return "bg-green-500";
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
        <div className="cursor-pointer">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0">
        <div className="bg-gradient-to-b from-primary/30 to-transparent h-12 rounded-t-md relative"></div>
        <div className="px-4 pb-4 pt-10 relative">
          <div className="absolute -top-6 left-4 flex items-end">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-background shadow-md">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(effectiveStatus)}`}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 ml-3 mb-1">
                <div className="flex flex-col">
                  <h4 className="font-semibold text-base">{displayName}</h4>
                  <span className="text-xs text-muted-foreground">@{username}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${effectiveStatus === "online" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                    effectiveStatus === "away" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                    effectiveStatus === "do_not_disturb" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                    "bg-gray-500/10 text-gray-500 border-gray-500/20"}`}
                >
                  {effectiveStatus.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-6 mb-4">
            <p className="text-sm text-muted-foreground">{bio}</p>
            <p className="text-xs text-muted-foreground mt-2">Joined {joinedDate}</p>
          </div>
          
          {(mutualFriends > 0 || mutualServers > 0) && (
            <div className="border-t border-border pt-3 mt-3">
              <div className="flex gap-4 text-xs text-muted-foreground">
                {mutualFriends > 0 && (
                  <span>{mutualFriends} mutual friend{mutualFriends !== 1 ? 's' : ''}</span>
                )}
                {mutualServers > 0 && (
                  <span>{mutualServers} mutual server{mutualServers !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="w-full">
              <MessageSquare size={14} className="mr-1" />
              Message
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <UserPlus size={14} className="mr-1" />
              Add Friend
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
