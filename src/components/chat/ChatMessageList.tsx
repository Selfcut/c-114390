
import React, { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  formatTime: (date: Date) => string;
}

export const ChatMessageList = ({ 
  messages, 
  isLoading,
  formatTime
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2 animate-pulse">
              <div className="h-8 w-8 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 p-3">
      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              formatTime={formatTime} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-4">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-medium mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground">Be the first to start the conversation!</p>
          </div>
        </div>
      )}
    </ScrollArea>
  );
};
