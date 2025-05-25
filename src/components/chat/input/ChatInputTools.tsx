
import React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, AtSign } from 'lucide-react';

interface ChatInputToolsProps {
  onFileUpload?: () => void;
  onMentionUser?: (username: string) => void;
}

export const ChatInputTools: React.FC<ChatInputToolsProps> = ({
  onFileUpload,
  onMentionUser
}) => {
  return (
    <div className="flex items-center gap-1">
      {onFileUpload && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-accent hover:text-accent-foreground"
          onClick={onFileUpload}
          type="button"
        >
          <Paperclip size={16} />
          <span className="sr-only">Attach file</span>
        </Button>
      )}
      
      {onMentionUser && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-accent hover:text-accent-foreground"
          onClick={() => onMentionUser('user')}
          type="button"
        >
          <AtSign size={16} />
          <span className="sr-only">Mention user</span>
        </Button>
      )}
    </div>
  );
};
