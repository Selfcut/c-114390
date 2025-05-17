
import React from "react";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface MediaErrorDisplayProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const MediaErrorDisplay = ({ message, onRetry, isRetrying = false }: MediaErrorDisplayProps) => {
  return (
    <ErrorMessage
      title="Connection Error"
      message={message}
      retry={onRetry}
      isRetrying={isRetrying}
      variant="destructive"
    />
  );
};
