
import { formatTime as formatTimeUtil } from '@/components/chat/utils/formatTime';

export const useMessageUtils = () => {
  // Enhanced time formatting utility
  const formatTime = (timestamp: string): string => {
    if (!timestamp) return '';
    
    try {
      return formatTimeUtil(timestamp);
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      // Fallback to basic format if there's an error
      return new Date(timestamp).toLocaleTimeString();
    }
  };

  // Add utility to truncate messages for previews
  const truncateMessage = (message: string, maxLength: number = 50): string => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    
    // Try to truncate at a space to avoid cutting words
    const truncated = message.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      // If we can find a space that's reasonably close to our max length
      return message.substring(0, lastSpace) + '...';
    } else {
      return truncated + '...';
    }
  };

  // Parse markdown links in messages
  const parseMessageLinks = (message: string): string => {
    if (!message) return '';
    
    // Replace markdown links with HTML
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    let processed = message.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
    
    // Also handle plain URLs
    processed = processed.replace(urlRegex, (url) => {
      // Avoid replacing URLs that are already part of a markdown link
      if (message.includes(`](${url})`) || processed.includes(`href="${url}"`)) {
        return url;
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${url}</a>`;
    });
    
    return processed;
  };

  // Extract @mentions from messages
  const extractMentions = (message: string): string[] => {
    if (!message) return [];
    
    const mentionRegex = /@(\w+)/g;
    const matches = [];
    let match;
    
    while ((match = mentionRegex.exec(message)) !== null) {
      matches.push(match[1]);
    }
    
    return matches;
  };

  // Format messages with GIFs
  const formatMessageWithMedia = (message: string): { text: string, media: { type: string, url: string, alt: string }[] } => {
    const media: { type: string, url: string, alt: string }[] = [];
    
    // Extract markdown image syntax for GIFs and images
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    let processedMessage = message;
    
    while ((match = imageRegex.exec(message)) !== null) {
      const [fullMatch, alt, url] = match;
      const isGif = url.toLowerCase().endsWith('.gif') || url.includes('giphy.com');
      
      media.push({
        type: isGif ? 'gif' : 'image',
        url: url,
        alt: alt || 'Image'
      });
      
      // Remove the image syntax from the message
      processedMessage = processedMessage.replace(fullMatch, '');
    }
    
    return {
      text: processedMessage.trim(),
      media
    };
  };

  return {
    formatTime,
    truncateMessage,
    parseMessageLinks,
    extractMentions,
    formatMessageWithMedia
  };
};
