
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationItem } from "./ConversationItem";
import { ConversationItem as ConversationType } from "./types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

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
  // Start collapsed by default
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div 
        className="flex items-center justify-between px-2 cursor-pointer" 
        onClick={toggleExpand}
      >
        <h3 className="text-sm font-medium">Rooms</h3>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            title="Create new chat room"
          >
            <Plus size={16} />
            <span className="sr-only">Create new chat room</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
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
              <div className="flex flex-col items-center justify-center h-20 space-y-2">
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <Skeleton className="h-16 w-full" />
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
