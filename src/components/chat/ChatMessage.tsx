
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
  formatTime: (date: Date) => string;
}

export const ChatMessage = ({ message, formatTime }: ChatMessageProps) => {
  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.sender.avatar} />
        <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium text-sm ${message.sender.isSystem ? 'text-primary' : ''}`}>
            {message.sender.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <p className="text-sm break-words">{message.content}</p>
      </div>
    </div>
  );
};
