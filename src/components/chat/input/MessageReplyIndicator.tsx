
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Reply } from 'lucide-react';

interface MessageReplyIndicatorProps {
  replyingToMessage: {
    id: string;
    content: string;
    senderName: string;
  };
  onCancelReply: () => void;
}

export const MessageReplyIndicator = ({ replyingToMessage, onCancelReply }: MessageReplyIndicatorProps) => {
  return (
    <div className="flex items-start justify-between p-2 bg-muted/50 rounded-t-md border-0 mb-2">
      <div className="flex items-start space-x-2 flex-1">
        <Reply size={14} className="mt-0.5 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-muted-foreground">
            Replying to {replyingToMessage.senderName}
          </div>
          <div className="text-sm text-foreground truncate">
            {replyingToMessage.content}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancelReply}
        className="h-6 w-6 p-0 flex-shrink-0"
      >
        <X size={14} />
      </Button>
    </div>
  );
};
