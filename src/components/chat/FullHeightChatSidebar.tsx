
import React, { useRef } from "react";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatActions } from "./hooks/useChatActions";
import { useSpecialEffects } from "./hooks/useSpecialEffects";
import { useAdminStatus } from "./hooks/useAdminStatus";
import { useRealtimeChatSubscription } from "./hooks/useRealtimeChatSubscription";
import { useAutomatedMessages } from "./hooks/useAutomatedMessages";
import { useAuth } from "@/lib/auth";
import { CollapsedChatButton } from "./CollapsedChatButton";
import { ChatSidebarContainer } from "./ChatSidebarContainer";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ChatContent } from "./ChatContent";
import { ChatAnimationStyles } from "./ChatAnimationStyles";
import { formatTime } from "./utils/formatTime";

export const FullHeightChatSidebar = () => {
  const { isOpen, toggleSidebar } = useChatSidebarToggle();
  const { user } = useAuth();
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
      {!isOpen && <CollapsedChatButton onClick={toggleSidebar} />}
      
      <ChatSidebarContainer isOpen={isOpen}>
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />
        
        <ChatContent
          isLoadingMessages={isLoadingMessages}
          messages={messages}
          isLoading={isLoading}
          formatTime={formatTime}
          onMessageEdit={handleEditMessage}
          onMessageDelete={handleDeleteMessage}
          onMessageReply={handleReplyToMessage}
          onReactionAdd={handleReactionAdd}
          onReactionRemove={handleReactionRemove}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          editingMessageId={editingMessageId}
          replyingToMessage={replyingToMessage}
          onCancelEdit={cancelEdit}
          onCancelReply={cancelReply}
          onEmojiSelect={handleEmojiSelect}
          onGifSelect={handleGifSelect}
          isAdmin={isAdmin}
          onAdminEffectSelect={handleAdminEffectSelect}
          messagesEndRef={messagesEndRef}
          currentUserId={user?.id || null}
        />
        
        <ChatAnimationStyles />
      </ChatSidebarContainer>
    </>
  );
};
