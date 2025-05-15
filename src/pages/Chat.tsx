
import React, { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { ChatInterface } from "../components/chat/ChatInterface";
import { ConversationList, Conversation } from "../components/chat/ConversationList";
import { EmptyConversationState } from "../components/chat/EmptyConversationState";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationType, setConversationType] = useState<'direct' | 'group' | 'global'>('direct');
  
  // Handle conversation selection
  const handleConversationSelect = (conversation: Conversation, type: 'direct' | 'group' | 'global') => {
    setSelectedConversation(conversation);
    setConversationType(type);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex">
              {/* Chat sidebar with conversation list */}
              <ConversationList
                onSelectConversation={handleConversationSelect}
                selectedConversationId={selectedConversation?.id}
                conversationType={conversationType}
              />
              
              {/* Chat main area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <ChatInterface 
                    chatType={conversationType}
                    recipientId={conversationType === 'direct' ? selectedConversation.id : undefined}
                    recipientName={conversationType === 'direct' ? selectedConversation.name : undefined}
                    recipientAvatar={conversationType === 'direct' ? selectedConversation.avatar : undefined}
                    groupId={conversationType === 'group' ? selectedConversation.id : undefined}
                    groupName={conversationType === 'group' ? selectedConversation.name : undefined}
                  />
                ) : (
                  <EmptyConversationState />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
