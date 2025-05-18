
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Reply } from "lucide-react";

interface MessageActionsProps {
  isCurrentUser: boolean;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  messageId: string;
}

export const MessageActions = ({
  isCurrentUser,
  onEdit,
  onDelete,
  onReply,
  messageId
}: MessageActionsProps) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(messageId);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(messageId);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(messageId);
    }
  };

  return (
    <div className="absolute -right-12 top-3 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
      {isCurrentUser && onEdit && (
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleEdit}>
          <Edit size={14} />
          <span className="sr-only">Edit</span>
        </Button>
      )}
      
      {isCurrentUser && onDelete && (
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleDelete}>
          <Trash2 size={14} />
          <span className="sr-only">Delete</span>
        </Button>
      )}
      
      {onReply && (
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleReply}>
          <Reply size={14} />
          <span className="sr-only">Reply</span>
        </Button>
      )}
    </div>
  );
};
