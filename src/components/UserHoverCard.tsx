
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface UserHoverCardProps {
  username: string;
  avatar?: string;
  displayName: string;
  status?: "online" | "offline" | "away" | "do-not-disturb" | "invisible";
  bio?: string;
  joinDate?: string;
  level?: number;
  iq?: number;
  badges?: { id: string; name: string }[];
  fieldOfStudy?: string[];
  children: React.ReactNode;
}

export function UserHoverCard({
  username,
  avatar,
  displayName,
  status = "offline",
  bio = "Polymath member",
  joinDate = "January 2025",
  level = 1,
  iq = 100,
  badges = [],
  fieldOfStudy = [],
  children,
}: UserHoverCardProps) {
  // Generate status color based on status
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "do-not-disturb":
        return "bg-red-500";
      case "invisible":
      case "offline":
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    if (status === "do-not-disturb") return "Do Not Disturb";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div>{children}</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 rounded-md">
              <AvatarImage src={avatar} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center">
                <h4 className="font-semibold">{displayName}</h4>
                <div className={`h-2 w-2 rounded-full ml-2 ${getStatusColor()}`} />
                <span className="text-xs text-muted-foreground ml-1">
                  {getStatusText()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">@{username}</p>
              <div className="flex gap-2">
                <div className="flex items-center text-xs">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Level {level}
                  </Badge>
                </div>
                <div className="flex items-center text-xs">
                  <Brain size={12} className="mr-1 text-amber-500" />
                  <span className="text-muted-foreground">IQ {iq}</span>
                </div>
              </div>
            </div>
          </div>

          {bio && <p className="text-sm">{bio}</p>}

          {fieldOfStudy && fieldOfStudy.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {fieldOfStudy.map((field, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {field}
                </Badge>
              ))}
            </div>
          )}

          {badges && badges.length > 0 && (
            <div className="flex space-x-1">
              {badges.slice(0, 3).map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center bg-accent/50 rounded-full px-2 py-0.5"
                >
                  <Award size={12} className="mr-1 text-primary" />
                  <span className="text-xs">{badge.name}</span>
                </div>
              ))}
              {badges.length > 3 && (
                <div className="flex items-center bg-accent/50 rounded-full px-2 py-0.5">
                  <span className="text-xs">+{badges.length - 3} more</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span>Joined {joinDate}</span>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" asChild className="flex-1">
              <Link to={`/profile/${username}`}>View Profile</Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="flex-1">
              <Link to={`/chat?direct=${username}`}>Message</Link>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
