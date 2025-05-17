
import React from "react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";

interface MediaErrorDisplayProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
  onBack?: () => void;
}

export const MediaErrorDisplay = ({ 
  message, 
  onRetry, 
  isRetrying = false,
  onBack
}: MediaErrorDisplayProps) => {
  return (
    <ErrorMessage
      title="Connection Error"
      message={message}
      retry={onRetry}
      isRetrying={isRetrying}
      variant="destructive"
      action={onBack && (
        <Button variant="ghost" size="sm" onClick={onBack}>
          Go Back
        </Button>
      )}
    />
  );
};
