
import { format } from "date-fns";

export const useMessageUtils = () => {
  // Format time for display
  const formatTime = (timestamp: string) => {
    try {
      // Handle undefined, null or empty string case
      if (!timestamp) {
        return "Just now";
      }
      
      const date = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn("Invalid date in formatTime:", timestamp);
        return "Just now";
      }
      
      // Today's date for comparison
      const today = new Date();
      const isToday = today.toDateString() === date.toDateString();
      
      if (isToday) {
        return format(date, "h:mm a");
      } else {
        return format(date, "MMM d 'at' h:mm a");
      }
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Just now";
    }
  };

  // Group messages by date
  const groupMessagesByDate = <T extends { createdAt: string }>(messages: T[]) => {
    return messages.reduce((groups: Record<string, T[]>, message) => {
      try {
        // Handle potentially null or undefined createdAt
        if (!message.createdAt) {
          if (!groups['Recent']) {
            groups['Recent'] = [];
          }
          groups['Recent'].push(message);
          return groups;
        }
        
        const date = new Date(message.createdAt);
        
        // Skip invalid dates
        if (isNaN(date.getTime())) {
          console.warn("Invalid date in groupMessagesByDate:", message.createdAt);
          
          // Group invalid dates together
          if (!groups['Recent']) {
            groups['Recent'] = [];
          }
          groups['Recent'].push(message);
          return groups;
        }
        
        const dateKey = date.toLocaleDateString();
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      } catch (error) {
        console.error("Error grouping message by date:", error);
        
        // Default grouping for errors
        if (!groups['Recent']) {
          groups['Recent'] = [];
        }
        groups['Recent'].push(message);
      }
      return groups;
    }, {});
  };

  return {
    formatTime,
    groupMessagesByDate
  };
};
