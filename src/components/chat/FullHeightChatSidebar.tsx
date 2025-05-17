
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInputArea } from "./ChatInputArea";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatActions } from "./hooks/useChatActions";
import { useSpecialEffects } from "./hooks/useSpecialEffects";
import { useAdminStatus } from "./hooks/useAdminStatus";
import { useRealtimeChatSubscription } from "./hooks/useRealtimeChatSubscription";
import { useAutomatedMessages } from "./hooks/useAutomatedMessages";

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { isAdmin } = useAdminStatus();
  const { messages, setMessages, isLoadingMessages, fetchMessages, addMessage } = useChatMessages();
  const { 
    isLoading, 
    inputMessage, 
    setInputMessage, 
    replyingToMessage, 
    editingMessageId, 
    handleSendMessage, 
    handleAdminEffectSelect, 
    handleEditMessage, 
    handleDeleteMessage, 
    handleReplyToMessage, 
    cancelEdit, 
    cancelReply, 
    handleKeyDown 
  } = useChatActions();
  const { handleSpecialEffect } = useSpecialEffects();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Use our custom hooks
  useRealtimeChatSubscription({ isOpen, addMessage, scrollToBottom, handleSpecialEffect });
  useAutomatedMessages({ isOpen, messages, addMessage, scrollToBottom });

  // Fetch messages when the sidebar is opened
  React.useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, fetchMessages]);

  // Format time helper
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(inputMessage + emoji);
  };

  // Handle GIF selection
  const handleGifSelect = (gif: { url: string; alt: string }) => {
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    setInputMessage(inputMessage + " " + gifMarkdown);
  };

  // Handle reaction add/remove
  const handleReactionAdd = async (messageId: string, emoji: string) => {
    // In a real app, this would update a reactions table in the database
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReactions = msg.reactions || [];
          const existingReaction = existingReactions.find(r => r.emoji === emoji);
          
          let updatedReactions;
          if (existingReaction) {
            // Increase count if reaction exists and user hasn't already reacted
            if (!existingReaction.users.includes(msg.userId || 'anonymous')) {
              updatedReactions = existingReactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, msg.userId || 'anonymous'] }
                  : r
              );
            } else {
              // User already reacted with this emoji
              updatedReactions = existingReactions;
            }
          } else {
            // Add new reaction type
            updatedReactions = [
              ...existingReactions, 
              { emoji, count: 1, users: [msg.userId || 'anonymous'] }
            ];
          }
          
          return { ...msg, reactions: updatedReactions };
        }
        return msg;
      })
    );
  };

  const handleReactionRemove = async (messageId: string, emoji: string) => {
    // Similar to add, but removing the reaction
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId && msg.reactions) {
          const updatedReactions = msg.reactions.map(r => {
            if (r.emoji === emoji && r.users.includes(msg.userId || 'anonymous')) {
              return {
                ...r,
                count: Math.max(0, r.count - 1),
                users: r.users.filter(id => id !== msg.userId)
              };
            }
            return r;
          }).filter(r => r.count > 0);
          
          return { ...msg, reactions: updatedReactions };
        }
        return msg;
      })
    );
  };

  return (
    <>
      {/* Collapsed button that's always visible when chat is closed */}
      {!isOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed right-4 bottom-4 h-12 w-12 rounded-full shadow-md z-40 bg-primary hover:bg-primary/90"
          aria-label="Open chat"
        >
          <MessageSquare size={20} />
        </Button>
      )}
      
      {/* Expanded sidebar */}
      <div 
        className={`fixed top-0 right-0 h-screen bg-background border-l border-border shadow-lg transition-all duration-300 z-40 flex flex-col chat-container ${
          isOpen ? 'translate-x-0 w-[var(--chat-sidebar-width)]' : 'translate-x-full w-0'
        }`}
      >
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {isLoadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <ChatMessageList 
                messages={messages}
                isLoading={isLoading}
                formatTime={formatTime}
                onMessageEdit={handleEditMessage}
                onMessageDelete={handleDeleteMessage}
                onMessageReply={handleReplyToMessage}
                onReactionAdd={handleReactionAdd}
                onReactionRemove={handleReactionRemove}
                currentUserId={null}
                messagesEndRef={messagesEndRef}
              />
            </ScrollArea>
          )}
          
          <ChatInputArea 
            message={inputMessage}
            setMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleKeyDown={handleKeyDown}
            editingMessage={editingMessageId}
            replyingToMessage={replyingToMessage}
            onCancelEdit={cancelEdit}
            onCancelReply={cancelReply}
            onEmojiSelect={handleEmojiSelect}
            onGifSelect={handleGifSelect}
            isAdmin={isAdmin}
            onAdminEffectSelect={handleAdminEffectSelect}
          />
        </div>
        
        {/* Add styles for our shake animation */}
        <style>
          {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .shake-animation {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          `}
        </style>
      </div>
    </>
  );
};
