
import React from 'react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface ContentFeedErrorProps {
  message: string;
}

export const ContentFeedError: React.FC<ContentFeedErrorProps> = ({ message }) => {
  return (
    <ErrorMessage
      title="Error"
      message={message}
      variant="destructive"
    />
  );
};
