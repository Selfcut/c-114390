
import React, { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { ChatInterface } from "../components/chat/ChatInterface";
import { ConversationList, Conversation } from "../components/chat/ConversationList";
import { EmptyConversationState } from "../components/chat/EmptyConversationState";
import { useSearchParams } from "react-router-dom";
import { UserStatus } from "@/types/user";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const directParam = searchParams.get('direct');
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationType, setConversationType] = useState<'direct' | 'group' | 'global'>('direct');
  
  // Check if we need to preselect a conversation based on URL params
  useEffect(() => {
    if (directParam) {
      // Here you would fetch the conversation details based on the username
      // For now we'll just use a placeholder
      setSelectedConversation({
        id: `direct-${directParam}`,
        name: directParam,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${directParam}`,
        status: "online" as UserStatus
      });
      setConversationType('direct');
    }
  }, [directParam]);
  
  // Handle conversation selection
  const handleConversationSelect = (conversation: Conversation, type: 'direct' | 'group' | 'global') => {
    setSelectedConversation(conversation);
    setConversationType(type);
  };
  
  return (
    <PageLayout>
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
              recipientStatus={conversationType === 'direct' ? selectedConversation.status as UserStatus : undefined}
              groupId={conversationType === 'group' ? selectedConversation.id : undefined}
              groupName={conversationType === 'group' ? selectedConversation.name : undefined}
              groupAvatar={conversationType === 'group' ? selectedConversation.avatar : undefined}
              groupMembers={conversationType === 'group' && selectedConversation.members ? 
                selectedConversation.members.map(member => ({
                  ...member,
                  // Add a default status since the member object doesn't have one
                  status: 'offline' as UserStatus
                })) :
                undefined}
            />
          ) : (
            <EmptyConversationState />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Chat;
