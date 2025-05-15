
import React from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSidebarHeaderProps {
  toggleSidebar: () => void;
}

export const ChatSidebarHeader = ({ toggleSidebar }: ChatSidebarHeaderProps) => {
  return (
    <div className="border-b p-3 flex justify-between items-center">
      <h2 className="text-lg font-semibold flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" />
        Community Chat
      </h2>
      <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Close chat">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
