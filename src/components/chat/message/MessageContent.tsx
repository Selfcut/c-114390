
import React from "react";

interface MessageContentProps {
  content: string;
  className: string;
}

export const MessageContent = ({ content, className }: MessageContentProps) => {
  // Function to check if message contains markdown image
  const containsImage = (content: string) => {
    return /!\[.*?\]\(.*?\)/.test(content);
  };

  // Function to render markdown content
  const renderContent = (content: string) => {
    // Check for GIF or image markdown format: ![alt](url)
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(content)) !== null) {
      // Add text before the image
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex, match.index)}</span>);
      }

      // Add the image
      const alt = match[1];
      const url = match[2];
      parts.push(
        <img 
          key={`img-${match.index}`} 
          src={url} 
          alt={alt} 
          className="max-w-full rounded-md my-1 max-h-60 object-contain" 
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div className={className}>
      {renderContent(content)}
    </div>
  );
};
