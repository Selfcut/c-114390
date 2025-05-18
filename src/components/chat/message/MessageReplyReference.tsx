
import React from "react";
import { Reply } from "lucide-react";

interface MessageReplyReferenceProps {
  replyTo: {
    sender: {
      name: string;
    };
    content: string;
  };
}

export const MessageReplyReference = ({ replyTo }: MessageReplyReferenceProps) => {
  if (!replyTo) return null;
  
  return (
    <div className="flex items-center text-xs text-muted-foreground mb-1 ml-12">
      <Reply size={12} className="mr-1" />
      Replying to <span className="font-medium ml-1">{replyTo.sender.name}</span>:
      <span className="ml-1 truncate max-w-[150px]">"{replyTo.content}"</span>
    </div>
  );
};
