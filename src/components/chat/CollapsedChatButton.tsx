
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface CollapsedChatButtonProps {
  onClick: () => void;
}

export const CollapsedChatButton = ({ onClick }: CollapsedChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed right-4 bottom-4 h-12 w-12 rounded-full shadow-md z-40 bg-primary hover:bg-primary/90"
      aria-label="Open chat"
    >
      <MessageSquare size={20} />
    </Button>
  );
};
