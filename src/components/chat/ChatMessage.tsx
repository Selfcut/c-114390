
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageReactions, Reaction } from "./MessageReactions";
import { MoreHorizontal, Reply, Star, Trash } from "lucide-react";
import { UserHoverCard } from "../UserHoverCard";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    status: "online" | "offline" | "away" | "do_not_disturb";
  };
  timestamp: Date;
  reactions: Reaction[];
  isCurrentUser: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  mentions?: Array<{ id: string; name: string }>;
  attachments?: Array<{ id: string; type: 'image' | 'gif' | 'file'; url: string; name?: string }>;
  onReply?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, emoji: string) => void;
}

export const ChatMessage = ({
  id,
  content,
  sender,
  timestamp,
  reactions,
  isCurrentUser,
  isFirstInGroup = true,
  isLastInGroup = true,
  mentions = [],
  attachments = [],
  onReply,
  onDelete,
  onReactionAdd,
  onReactionRemove
}: ChatMessageProps) => {
  const [showActions, setShowActions] = useState(false);
  
  // Format message content to highlight mentions
  const formattedContent = React.useMemo(() => {
    let formattedText = content;
    mentions.forEach(mention => {
      formattedText = formattedText.replace(
        new RegExp(`@${mention.name}`, 'g'),
        `<span class="mention">@${mention.name}</span>`
      );
    });
    
    return formattedText;
  }, [content, mentions]);

  return (
    <div 
      className={`group relative px-4 py-1 hover:bg-muted/30 ${isFirstInGroup ? 'pt-2' : ''} ${isLastInGroup ? 'pb-2' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Timestamp for first message in group */}
      {isFirstInGroup && (
        <div className="flex items-center mb-0.5">
          <UserHoverCard
            username={sender.username}
            avatar={sender.avatar}
            status={sender.status}
            displayName={sender.name}
          >
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={sender.avatar} />
              <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </UserHoverCard>
          <div>
            <div className="flex items-center">
              <span className="font-medium text-sm">{sender.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {format(timestamp, 'h:mm a')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message content */}
      <div 
        className={`pl-10 break-words ${isFirstInGroup ? '' : 'mt-0.5'}`}
      >
        <div 
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
        
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mt-1 space-y-1">
            {attachments.map(attachment => (
              <div key={attachment.id} className="rounded-md overflow-hidden max-w-sm">
                {attachment.type === 'image' && (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name || "Image attachment"} 
                    className="max-w-full h-auto rounded-md"
                  />
                )}
                {attachment.type === 'gif' && (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name || "GIF attachment"} 
                    className="max-w-full h-auto rounded-md"
                  />
                )}
                {attachment.type === 'file' && (
                  <div className="flex items-center bg-muted p-2 rounded-md">
                    <span className="truncate text-sm">{attachment.name || "File attachment"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message reactions */}
        {reactions.length > 0 && (
          <MessageReactions
            reactions={reactions}
            messageId={id}
            onReactionAdd={onReactionAdd}
            onReactionRemove={onReactionRemove}
          />
        )}
      </div>

      {/* Message actions */}
      {showActions && (
        <div className="absolute top-0 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-md border shadow-sm p-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => onReactionAdd(id, "👍")}
            >
              👍
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={() => onReply && onReply(id)}
            >
              <Reply size={14} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 rounded-full"
                >
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center">
                  <Star size={14} className="mr-2" />
                  <span>Save Message</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center text-destructive"
                  onClick={() => onDelete && onDelete(id)}
                >
                  <Trash size={14} className="mr-2" />
                  <span>Delete Message</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </div>
  );
};
