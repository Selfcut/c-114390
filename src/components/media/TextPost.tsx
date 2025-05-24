
import React from 'react';

interface TextPostProps {
  content: string;
  className?: string;
}

export const TextPost: React.FC<TextPostProps> = ({ content, className = "" }) => {
  return (
    <div className={`relative bg-muted/20 rounded-lg p-6 ${className}`}>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};
