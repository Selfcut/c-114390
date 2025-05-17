
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MessageReplyIndicatorProps {
  replyingToMessage: {
    id: string;
    content: string;
    senderName: string;
  };
  onCancelReply: () => void;
}

export const MessageReplyIndicator = ({ 
  replyingToMessage, 
  onCancelReply 
}: MessageReplyIndicatorProps) => {
  return (
    <div className="mb-2 px-3 py-1.5 bg-muted/50 rounded-md flex items-center justify-between">
      <div>
        <span className="text-xs text-muted-foreground">
          Replying to <span className="font-medium">{replyingToMessage.senderName}</span>
        </span>
        <p className="text-xs line-clamp-1 text-muted-foreground max-w-[250px]">
          {replyingToMessage.content.length > 50 
            ? `${replyingToMessage.content.substring(0, 50)}...` 
            : replyingToMessage.content}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0"
        onClick={onCancelReply}
      >
        <X size={14} />
        <span className="sr-only">Cancel reply</span>
      </Button>
    </div>
  );
};
