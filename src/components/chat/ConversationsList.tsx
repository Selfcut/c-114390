
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationItem } from "./ConversationItem";
import { ConversationItem as ConversationType } from "./types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default
  
  const toggleExpand = () => {
    console.log("Toggling conversation list expand state:", !isExpanded);
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div 
        className="flex items-center justify-between px-2 cursor-pointer" 
        onClick={toggleExpand}
      >
        <h3 className="text-sm font-medium">Rooms</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {isExpanded && (
        <ScrollArea className="h-[240px]">
          <div className="space-y-2 p-2">
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
      )}
    </div>
  );
};
