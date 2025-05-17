
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MessageEditingIndicatorProps {
  onCancelEdit: () => void;
}

export const MessageEditingIndicator = ({ onCancelEdit }: MessageEditingIndicatorProps) => {
  return (
    <div className="mb-2 px-3 py-1.5 bg-primary/10 rounded-md flex items-center justify-between">
      <span className="text-xs text-muted-foreground">Editing message</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0"
        onClick={onCancelEdit}
      >
        <X size={14} />
        <span className="sr-only">Cancel edit</span>
      </Button>
    </div>
  );
};
