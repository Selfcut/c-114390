
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserHoverCardProps {
  children: React.ReactNode;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  joinDate?: string;
  badges?: Array<{id: string, name: string, color?: string}>;
  isOnline?: boolean;
  stats?: {
    discussions?: number;
    contributions?: number;
    karma?: number;
  }
}

export function UserHoverCard({
  children,
  username,
  displayName,
  avatarUrl,
  bio = "Member of the Polymath community",
  joinDate = "Joined January 2025",
  badges = [],
  isOnline = false,
  stats = { discussions: 0, contributions: 0, karma: 0 }
}: UserHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer relative">
          {children}
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
          )}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-sm font-semibold">{displayName}</h4>
                <p className="text-xs text-muted-foreground">@{username}</p>
              </div>
              {isOnline && (
                <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-500 border-green-500/20">
                  Online
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{bio}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {badges.map(badge => (
                <Badge key={badge.id} variant="outline" className={`text-xs ${badge.color || 'bg-primary/10 text-primary border-primary/20'}`}>
                  {badge.name}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center pt-2 text-xs text-muted-foreground">
              <CalendarDays className="mr-1 h-3 w-3" />
              {joinDate}
            </div>
            
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center text-xs text-muted-foreground" title="Discussions">
                <MessageSquare className="mr-1 h-3 w-3" />
                {stats.discussions}
              </div>
              <div className="flex items-center text-xs text-muted-foreground" title="Karma points">
                <Award className="mr-1 h-3 w-3" />
                {stats.karma}
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="w-full">Profile</Button>
              <Button variant="outline" size="sm" className="w-full">Message</Button>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
