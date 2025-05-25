
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Edit } from 'lucide-react';

interface MessageEditingIndicatorProps {
  onCancelEdit: () => void;
}

export const MessageEditingIndicator: React.FC<MessageEditingIndicatorProps> = ({
  onCancelEdit
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 mb-2 rounded">
      <div className="flex items-center space-x-2">
        <Edit size={16} className="text-blue-600" />
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          Editing message
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancelEdit}
        className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
      >
        <X size={14} />
      </Button>
    </div>
  );
};
