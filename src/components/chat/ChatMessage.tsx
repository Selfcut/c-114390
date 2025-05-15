
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Reply,
  Bookmark,
  Flag,
  Forward,
  Link as LinkIcon,
  SmilePlus,
} from "lucide-react";
import { UserStatus } from "@/types/user";

// Emoji data for reactions
const emojiData = [
  { emoji: "👍", label: "thumbs up" },
  { emoji: "❤️", label: "heart" },
  { emoji: "😂", label: "joy" },
  { emoji: "🎉", label: "celebration" },
  { emoji: "🤔", label: "thinking" },
  { emoji: "👀", label: "eyes" },
  { emoji: "🔥", label: "fire" },
  { emoji: "✨", label: "sparkles" },
  { emoji: "🙏", label: "pray" },
  { emoji: "👏", label: "clap" },
];

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    status: UserStatus;
  };
  isCurrentUser: boolean;
  timestamp: Date;
  isEdited?: boolean;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  attachments?: Array<{
    id: string;
    type: "image" | "file" | "audio" | "video" | "gif";
    url: string;
    name: string;
    size?: number;
    dimensions?: { width: number; height: number };
  }>;
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
  mentions?: string[];
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, emoji: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  content,
  sender,
  isCurrentUser,
  timestamp,
  isEdited = false,
  reactions = [],
  attachments = [],
  replyTo,
  mentions = [],
  onEdit,
  onDelete,
  onReply,
  onReactionAdd,
  onReactionRemove,
}) => {
  const [showActions, setShowActions] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Get status indicator color
  const getStatusIndicator = (status: UserStatus) => {
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

  // Parse mentions and links in content
  const parseContent = (text: string) => {
    // Replace @mentions with styled spans
    const mentionRegex = /@(\w+)/g;
    
    // Replace URLs with anchor tags
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // First handle mentions
    let formattedText = text.replace(mentionRegex, '<span class="mention">@$1</span>');
    
    // Then handle URLs
    formattedText = formattedText.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
    
    return formattedText;
  };

  // Handle user reaction to message
  const handleReaction = (emoji: string) => {
    const existingReaction = reactions.find((r) => r.emoji === emoji);
    
    if (existingReaction && existingReaction.users.includes(sender.id)) {
      onReactionRemove?.(id, emoji);
    } else {
      onReactionAdd?.(id, emoji);
    }
  };

  // Handle copy message content
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div
      ref={messageRef}
      className={`group flex gap-3 py-2 px-4 hover:bg-accent/20 transition-colors relative ${
        isCurrentUser ? "flex-row-reverse" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* User avatar with status */}
      <div className="relative flex-shrink-0 mt-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={sender.avatar} alt={sender.name} />
          <AvatarFallback>{sender.name[0]}</AvatarFallback>
        </Avatar>
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${getStatusIndicator(
            sender.status
          )}`}
        ></span>
      </div>

      {/* Message content container */}
      <div
        className={`flex flex-col max-w-[80%] ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        {/* Message header with sender name and timestamp */}
        <div
          className={`flex items-center gap-2 mb-1 ${
            isCurrentUser ? "flex-row-reverse" : ""
          }`}
        >
          <span className="font-medium text-sm hover:underline cursor-pointer">
            {sender.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(timestamp)}
            {isEdited && (
              <span className="ml-1 italic">(edited)</span>
            )}
          </span>
        </div>

        {/* Reply reference */}
        {replyTo && (
          <div className={`mb-1 text-sm rounded border-l-2 border-primary/50 pl-2 py-1 bg-accent/20 max-w-[90%] ${
            isCurrentUser ? "self-end" : "self-start"
          }`}>
            <div className="text-xs text-muted-foreground">
              Replying to <span className="font-medium">{replyTo.sender.name}</span>
            </div>
            <div className="truncate">{replyTo.content}</div>
          </div>
        )}

        {/* Message content */}
        <div className={`text-sm space-y-2 ${isCurrentUser ? "text-right" : "text-left"}`}>
          <div dangerouslySetInnerHTML={{ __html: parseContent(content) }} className="break-words"></div>
          
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {attachments.map((attachment) => (
                <div key={attachment.id}>
                  {attachment.type === "image" || attachment.type === "gif" ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="rounded-md max-h-48 object-cover cursor-pointer hover:opacity-90"
                    />
                  ) : attachment.type === "video" ? (
                    <video
                      src={attachment.url}
                      controls
                      className="rounded-md max-h-48 max-w-full"
                    ></video>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-accent rounded-md">
                      <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center">
                        <span className="text-xs">File</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{attachment.name}</span>
                        {attachment.size && (
                          <span className="text-xs text-muted-foreground">
                            {Math.round(attachment.size / 1024)} KB
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {reactions.map((reaction) => (
              <TooltipProvider key={reaction.emoji}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${
                        reaction.users.includes(sender.id)
                          ? "bg-primary/20 text-primary"
                          : "bg-accent hover:bg-accent/80"
                      }`}
                      onClick={() => handleReaction(reaction.emoji)}
                    >
                      <span>{reaction.emoji}</span>
                      <span>{reaction.count}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {reaction.users.length > 3
                        ? `${reaction.users.slice(0, 3).join(", ")} and ${
                            reaction.users.length - 3
                          } more`
                        : reaction.users.join(", ")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}
      </div>

      {/* Message actions */}
      {showActions && (
        <div
          className={`absolute flex items-center gap-1 top-0 ${
            isCurrentUser ? "left-4" : "right-4"
          }`}
        >
          {/* Reply button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onReply?.(id)}
                >
                  <Reply size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Reaction menu */}
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <SmilePlus size={14} />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Add Reaction</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="p-2 w-auto" align="center">
              <div className="flex flex-wrap gap-1 max-w-[200px]">
                {emojiData.map((item) => (
                  <TooltipProvider key={item.emoji}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            handleReaction(item.emoji);
                          }}
                        >
                          <span className="text-base">{item.emoji}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* More actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isCurrentUser && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleCopyContent}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Text</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Forward className="mr-2 h-4 w-4" />
                <span>Forward</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Save Message</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isCurrentUser ? (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete?.(id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Message</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => {}}>
                  <Flag className="mr-2 h-4 w-4" />
                  <span>Report Message</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
