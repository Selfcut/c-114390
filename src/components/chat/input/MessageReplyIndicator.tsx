
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

export const MessageReplyIndicator: React.FC<MessageReplyIndicatorProps> = ({
  replyingToMessage,
  onCancelReply
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 mb-2 rounded">
      <div className="flex items-center space-x-2 min-w-0 flex-1">
        <Reply size={16} className="text-green-600 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-green-700 dark:text-green-300 block">
            Replying to {replyingToMessage.senderName}
          </span>
          <span className="text-xs text-green-600 dark:text-green-400 truncate block">
            {replyingToMessage.content}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancelReply}
        className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900 flex-shrink-0"
      >
        <X size={14} />
      </Button>
    </div>
  );
};
