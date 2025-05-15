
import { ChatMessage } from "@/components/chat/types";

// Function to parse mentions in a message
export const parseMentions = (content: string): string[] => {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  
  let match;
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

// Function to format message content with mentions highlighted
export const formatMessageWithMentions = (content: string): React.ReactNode => {
  const parts = content.split(/(^|\s)@(\w+)/g);
  if (parts.length <= 1) return content;
  
  const formattedContent: React.ReactNode[] = [];
  
  for (let i = 0; i < parts.length; i += 3) {
    // Add regular text
    if (parts[i]) {
      formattedContent.push(parts[i]);
    }
    
    // Add mention if it exists
    if (i + 2 < parts.length) {
      const spacer = parts[i + 1] || '';
      const mention = parts[i + 2];
      
      if (mention) {
        formattedContent.push(
          spacer,
          <span key={`mention-${i}`} className="text-primary font-medium">
            @{mention}
          </span>
        );
      }
    }
  }
  
  return <>{formattedContent}</>;
};

// Parse markdown content with image support for GIFs
export const parseMarkdown = (content: string): React.ReactNode => {
  // Handle images/GIFs
  const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
  const parts = content.split(imgRegex);
  
  if (parts.length <= 1) {
    return formatMessageWithMentions(content);
  }
  
  const formattedContent: React.ReactNode[] = [];
  
  for (let i = 0; i < parts.length; i += 3) {
    // Add text content with mentions processed
    if (parts[i]) {
      formattedContent.push(formatMessageWithMentions(parts[i]));
    }
    
    // Add image if it exists
    if (i + 2 < parts.length) {
      const alt = parts[i + 1] || '';
      const url = parts[i + 2];
      
      if (url) {
        formattedContent.push(
          <div key={`img-${i}`} className="my-2 rounded overflow-hidden max-w-xs">
            <img src={url} alt={alt} className="max-w-full" />
          </div>
        );
      }
    }
  }
  
  return <>{formattedContent}</>;
};
