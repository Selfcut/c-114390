
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationItem } from "./ConversationItem";
import { ConversationItem as ConversationType } from "./types";

interface ConversationsListProps {
  conversations: ConversationType[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
}

export const ConversationsList = ({
  conversations,
  selectedConversation,
  onSelectConversation
}: ConversationsListProps) => {
  return (
    <div className="border-b p-2">
      <ScrollArea className="h-[120px]">
        <div className="space-y-2">
          {conversations.length > 0 ? (
            conversations.map((convo) => (
              <ConversationItem 
                key={convo.id}
                conversation={convo}
                isSelected={selectedConversation === convo.id}
                onSelect={onSelectConversation}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-20">
              <Skeleton className="h-16 w-full" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
