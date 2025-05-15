
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageReactionsProps {
  reactions: Reaction[];
  messageId: string;
  onReactionAdd: (messageId: string, emoji: string) => void;
}

export const MessageReactions = ({ 
  reactions, 
  messageId, 
  onReactionAdd 
}: MessageReactionsProps) => {
  // Current user ID (would come from auth context in a real app)
  const currentUserId = "current-user";

  // Filter out reactions with zero count
  const validReactions = reactions.filter(r => r.count > 0);

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {validReactions.map((reaction, index) => {
        const hasReacted = reaction.users.includes(currentUserId);
        
        return (
          <TooltipProvider key={`${reaction.emoji}-${index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-6 px-2 rounded-full text-xs gap-1 hover:bg-muted",
                    hasReacted ? "bg-primary/20" : "bg-muted/50"
                  )}
                  onClick={() => onReactionAdd(messageId, reaction.emoji)}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {reaction.users.length > 3
                    ? `${reaction.users.slice(0, 3).join(", ")} and ${reaction.users.length - 3} others`
                    : reaction.users.join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
