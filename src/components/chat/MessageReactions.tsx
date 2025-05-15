
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface MessageReactionsProps {
  reactions: Reaction[];
  messageId: string;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReact?: (emoji: string) => void; // Add this prop
  onReactionRemove?: (messageId: string, emoji: string) => void;
}

// Common quick reactions
const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "👏", "🔥", "🎉"];

export const MessageReactions = ({ 
  reactions, 
  messageId, 
  onReactionAdd,
  onReactionRemove,
  onReact
}: MessageReactionsProps) => {
  // Current user ID (would come from auth context in a real app)
  const currentUserId = "current-user";
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  // Filter out reactions with zero count
  const validReactions = reactions.filter(r => r.count > 0);

  const handleReactionToggle = (emoji: string) => {
    const existingReaction = validReactions.find(r => r.emoji === emoji);
    const hasReacted = existingReaction?.users.includes(currentUserId);
    
    if (hasReacted && onReactionRemove) {
      onReactionRemove(messageId, emoji);
    } else {
      onReactionAdd(messageId, emoji);
    }
    
    // Call onReact if provided
    if (onReact) {
      onReact(emoji);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
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
                  onClick={() => handleReactionToggle(reaction.emoji)}
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

      <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full hover:bg-muted"
          >
            <Smile size={14} />
            <span className="sr-only">Add reaction</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex gap-1">
            {quickReactions.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                onClick={() => {
                  onReactionAdd(messageId, emoji);
                  setShowReactionPicker(false);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
