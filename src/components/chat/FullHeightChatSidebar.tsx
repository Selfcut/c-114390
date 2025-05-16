
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSidebarHeader } from "./ChatSidebarHeader";
import { ConversationsList } from "./ConversationsList";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInputArea } from "./ChatInputArea";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatSidebarToggle } from "@/hooks/useChatSidebarToggle";
import { Conversation } from "./types";

export const FullHeightChatSidebar = () => {
  const { 
    conversations,
    selectedConversation,
    message,
    setMessage,
    messages,
    isLoading,
    formatTime,
    handleSendMessage,
    handleKeyDown,
    handleSelectConversation
  } = useChatMessages();
  
  const { isOpen, toggleSidebar } = useChatSidebarToggle();

  // Cast the conversations to the expected Conversation type
  const conversationsWithAvatars = conversations.map(conv => ({
    ...conv,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.name}`, // Generate avatar from name
    unread: 0 // Add unread count
  })) as Conversation[];

  return (
    <>
      {/* Chat toggle button (visible when sidebar is closed) */}
      {!isOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary hover:bg-primary/90"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat sidebar */}
      <aside 
        className={`fixed top-0 right-0 h-full bg-background border-l border-border w-[350px] transform transition-transform duration-300 ease-in-out z-40 shadow-lg flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <ChatSidebarHeader toggleSidebar={toggleSidebar} />

        {/* Conversations list */}
        <ConversationsList 
          conversations={conversationsWithAvatars}
          selectedConversation={selectedConversation}
          handleSelectConversation={handleSelectConversation}
        />

        {/* Messages area */}
        <ChatMessageList 
          messages={messages}
          isLoading={isLoading}
          formatTime={formatTime}
        />

        {/* Input area */}
        <ChatInputArea 
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
        />
      </aside>
    </>
  );
};
