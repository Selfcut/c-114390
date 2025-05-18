
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
    <div className="flex items-center text-xs text-muted-foreground mb-1 ml-10 gap-1">
      <Reply size={12} className="flex-shrink-0" />
      <span>Replying to <span className="font-medium">{replyTo.sender.name}</span>:</span>
      <span className="truncate max-w-[180px] italic">"{replyTo.content}"</span>
    </div>
  );
};
