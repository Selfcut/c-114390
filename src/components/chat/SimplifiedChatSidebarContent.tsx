
import React, { useState } from "react";
import { ConversationsList } from "./ConversationsList";
import { ChatMessage, ConversationItem } from "./types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";

interface SimplifiedChatSidebarContentProps {
  isOpen: boolean;
  selectedConversation: string;
  conversations: ConversationItem[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  currentUserId: string | null;
  onSelectConversation: (conversationId: string) => void;
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  onSendMessage: (content: string) => void;
}

export const SimplifiedChatSidebarContent: React.FC<SimplifiedChatSidebarContentProps> = ({
  isOpen,
  selectedConversation,
  conversations,
  messagesEndRef,
  currentUserId,
  onSelectConversation,
  messages,
  isLoadingMessages,
  onSendMessage
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b p-2">
        <ConversationsList 
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingMessages ? (
            <LoadingScreen message="Loading messages..." fullScreen={false} />
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm text-foreground">
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 resize-none"
              rows={1}
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
