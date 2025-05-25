
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MessageEditingIndicatorProps {
  onCancelEdit: () => void;
}

export const MessageEditingIndicator = ({ onCancelEdit }: MessageEditingIndicatorProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-t-md border-0 mb-2">
      <span className="text-sm text-muted-foreground">Editing message</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancelEdit}
        className="h-6 w-6 p-0"
      >
        <X size={14} />
      </Button>
    </div>
  );
};
