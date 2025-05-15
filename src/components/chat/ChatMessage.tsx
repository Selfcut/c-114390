
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageReactions } from "./MessageReactions";
import { Button } from "@/components/ui/button";
import { Reply, Trash, MoreVertical, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";

interface ChatMessageProps {
  id: string;
  content: string;
  timestamp: Date;
  isOwnMessage?: boolean;
  isCurrentUser?: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'do-not-disturb' | 'invisible';
  };
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  edited?: boolean;
  deleted?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  mentions?: Array<{ id: string; name: string }>;
  attachments?: Array<{ id: string; type: 'image' | 'gif' | 'file'; url: string; name?: string }>;
  onReply?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  content,
  timestamp,
  isOwnMessage = false,
  isCurrentUser = false, // Add this prop with default value
  sender,
  reactions = [],
  edited = false,
  deleted = false,
  isFirstInGroup = true,
  isLastInGroup = true,
  mentions,
  attachments,
  onReply,
  onDelete,
  onReact,
  onReactionAdd,
  onReactionRemove
}) => {
  const [showReactions, setShowReactions] = useState(false);
  
  // Use isCurrentUser or isOwnMessage, prioritizing isCurrentUser if passed
  const isMessageFromCurrentUser = isCurrentUser || isOwnMessage;
  
  // Determine status indicator color
  const getStatusColor = () => {
    switch (sender.status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'do-not-disturb': return 'bg-red-500';
      case 'invisible':
      case 'offline':
      default: return 'bg-gray-500';
    }
  };

  // Handle message deletion
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // Handle reply to message
  const handleReply = () => {
    if (onReply) {
      onReply(id);
    }
  };

  // Handle reaction to message
  const handleReact = (emoji: string) => {
    if (onReact) {
      onReact(id, emoji);
    } else if (onReactionAdd) {
      onReactionAdd(id, emoji);
    }
  };

  return (
    <div 
      className={`flex gap-2 mb-4 group ${isMessageFromCurrentUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      {!isOwnMessage && (
        <div className="relative flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender.avatar} alt={sender.name} />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {sender.status && (
            <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${getStatusColor()} ring-1 ring-background`} />
          )}
        </div>
      )}
      
      <div className={`flex flex-col max-w-[80%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{sender.name}</span>
            <span className="text-xs text-muted-foreground">{formatDateTime(timestamp)}</span>
          </div>
        )}
        
        <div className={`relative rounded-lg px-3 py-2 text-sm ${
          isOwnMessage 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          {deleted ? (
            <span className="italic text-muted-foreground">This message was deleted</span>
          ) : (
            <>
              <p>{content}</p>
              {edited && (
                <span className="text-xs opacity-70 ml-1 inline-flex items-center">
                  <Clock className="h-3 w-3 mr-0.5" /> edited
                </span>
              )}
            </>
          )}
        </div>
        
        {isOwnMessage && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{formatDateTime(timestamp)}</span>
          </div>
        )}
        
        {/* Message reactions */}
        {reactions.length > 0 && (
          <div className={`mt-1 ${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
            <MessageReactions 
              reactions={reactions} 
              messageId={id}
              onReactionAdd={(msgId, emoji) => onReact && onReact(msgId, emoji)}
              onReactionRemove={(msgId, emoji) => onReact && onReact(msgId, emoji)}
              onReact={handleReact}
            />
          </div>
        )}
        
        {/* Message actions */}
        {!deleted && showReactions && (
          <div className={`absolute ${isOwnMessage ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-0 flex items-center gap-1`}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full opacity-70 hover:opacity-100"
              onClick={handleReply}
            >
              <Reply className="h-4 w-4" />
            </Button>
            
            {isOwnMessage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full opacity-70 hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
