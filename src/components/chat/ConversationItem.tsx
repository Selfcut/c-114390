
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Conversation } from "./types";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ConversationItem = ({ 
  conversation, 
  isSelected, 
  onSelect 
}: ConversationItemProps) => {
  return (
    <Card 
      className={`p-2 hover:bg-accent/30 cursor-pointer ${isSelected ? 'bg-accent/50' : ''}`}
      onClick={() => onSelect(conversation.id)}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={conversation.avatar} alt={conversation.name} />
          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="font-medium text-sm flex items-center">
              {conversation.name}
              {conversation.isGlobal && (
                <Badge variant="secondary" className="ml-2 text-xs">Global</Badge>
              )}
              {conversation.isGroup && (
                <Badge variant="outline" className="ml-2 text-xs">Group</Badge>
              )}
            </div>
            {conversation.unread && conversation.unread > 0 && (
              <Badge className="bg-primary">{conversation.unread}</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
