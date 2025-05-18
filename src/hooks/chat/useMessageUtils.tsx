
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
    
    return message.substring(0, maxLength) + '...';
  };

  // Parse markdown links in messages
  const parseMessageLinks = (message: string): string => {
    if (!message) return '';
    
    // Replace markdown links with HTML
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return message.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  return {
    formatTime,
    truncateMessage,
    parseMessageLinks
  };
};
