
import React from "react";
import { MessageSquare } from "lucide-react";

export const EmptyConversationState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare size={24} className="text-primary" />
      </div>
      <h3 className="font-medium mb-2">No conversation selected</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Select a conversation from the sidebar to start chatting.
      </p>
    </div>
  );
};
