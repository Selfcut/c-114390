
import { format } from "date-fns";

export const useMessageUtils = () => {
  // Format time for display
  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (error) {
      return "Invalid time";
    }
  };

  // Group messages by date
  const groupMessagesByDate = <T extends { createdAt: string }>(messages: T[]) => {
    return messages.reduce((groups: Record<string, T[]>, message) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  return {
    formatTime,
    groupMessagesByDate
  };
};
