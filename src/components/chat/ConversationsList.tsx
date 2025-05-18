
import React from "react";
import { ConversationItem } from "./ConversationItem";
import { ConversationItem as ConversationItemType } from "./types";

interface ConversationsListProps {
  conversations: ConversationItemType[];
  selectedConversation: string;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationsList = ({
  conversations,
  selectedConversation,
  onSelectConversation
}: ConversationsListProps) => {
  return (
    <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
      {conversations.map(conversation => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedConversation === conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          onSelect={onSelectConversation}
        />
      ))}
      
      {conversations.length === 0 && (
        <div className="py-4 text-center text-muted-foreground">
          <p>No conversations found</p>
        </div>
      )}
    </div>
  );
};
