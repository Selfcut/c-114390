
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus } from 'lucide-react';

export interface UserHoverCardProps {
  username: string;
  displayName: string;
  avatar?: string;
  isOnline?: boolean;
  children: React.ReactNode;
}

export function UserHoverCard({
  username,
  displayName,
  avatar,
  isOnline = false,
  children
}: UserHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer relative">
          {children}
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} />
            <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 ml-2 flex-1">
            <h4 className="text-sm font-semibold">{displayName}</h4>
            <p className="text-xs text-muted-foreground">@{username}</p>
            <div className="flex items-center pt-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-xs text-muted-foreground">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="sm" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Follow
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
