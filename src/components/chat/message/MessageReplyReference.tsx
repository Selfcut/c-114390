
import React from "react";

interface MessageReplyReferenceProps {
  replyTo: {
    id: string;
    content: string;
    senderName: string;
  };
}

export const MessageReplyReference: React.FC<MessageReplyReferenceProps> = ({ replyTo }) => {
  return (
    <div className="mb-1 ml-10 px-3 py-1 bg-muted/50 rounded border-l-2 border-primary/30 text-xs max-w-[80%] text-muted-foreground">
      <span className="font-medium">{replyTo.senderName}</span>: {replyTo.content.length > 60 ? `${replyTo.content.substring(0, 60)}...` : replyTo.content}
    </div>
  );
};
