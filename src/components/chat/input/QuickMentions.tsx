
import React from "react";
import { Button } from "@/components/ui/button";

interface QuickMentionsProps {
  onMentionUser: (username: string) => void;
}

export const QuickMentions = ({ onMentionUser }: QuickMentionsProps) => {
  const quickMentions = ["global", "channel", "all"];
  
  return (
    <div className="flex gap-1 mt-2">
      {quickMentions.map((username) => (
        <Button 
          key={username}
          variant="outline" 
          size="sm" 
          className="h-6 px-2 text-xs" 
          onClick={() => onMentionUser(username)}
        >
          @{username}
        </Button>
      ))}
    </div>
  );
};
