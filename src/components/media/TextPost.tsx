
import React from 'react';

interface TextPostProps {
  content: string;
}

export const TextPost = ({ content }: TextPostProps) => {
  return (
    <div className="w-full aspect-video p-6 bg-muted/20 overflow-hidden flex items-center justify-center">
      <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden line-clamp-[12]">
        {content || <span className="text-muted-foreground">No content provided</span>}
      </div>
    </div>
  );
};
