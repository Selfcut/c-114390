
import React from "react";

interface MessageHeaderProps {
  senderName: string;
  isAdmin: boolean;
  formatTime: (timestamp: string) => string;
  createdAt: string;
  isEdited?: boolean;
}

export const MessageHeader = ({
  senderName,
  isAdmin,
  formatTime,
  createdAt,
  isEdited
}: MessageHeaderProps) => {
  if (!senderName) return null;
  
  return (
    <div className="flex items-center mb-1">
      <span className="font-medium text-sm">
        {senderName}
        {isAdmin && (
          <span className="ml-1 text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">
            Admin
          </span>
        )}
      </span>
      <span className="text-xs text-muted-foreground ml-2">
        {formatTime(createdAt)}
        {isEdited && <span className="ml-1">(edited)</span>}
      </span>
    </div>
  );
};
