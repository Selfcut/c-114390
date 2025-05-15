
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyConversationStateProps {
  onNewChat?: () => void;
}

export const EmptyConversationState = ({ onNewChat }: EmptyConversationStateProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare size={24} className="text-primary" />
      </div>
      <h3 className="font-medium text-lg mb-2">No conversation selected</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        Select a conversation from the sidebar or start a new chat to begin messaging.
      </p>
      {onNewChat && (
        <Button onClick={onNewChat} className="animate-pulse">
          Start a New Chat
        </Button>
      )}
    </div>
  );
};

export const EmptyInboxState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare size={24} className="text-primary" />
      </div>
      <h3 className="font-medium text-lg mb-2">Your inbox is empty</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        You don't have any messages yet. Connect with other users to start chatting!
      </p>
      <Button>
        Find People to Chat With
      </Button>
    </div>
  );
};

export const NoResultsState = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <MessageSquare size={24} className="text-muted-foreground" />
      </div>
      <h3 className="font-medium text-lg mb-2">No results found</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        We couldn't find any conversations matching "{searchTerm}". Try a different search term.
      </p>
    </div>
  );
};
