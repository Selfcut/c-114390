
import { formatTime as formatTimeUtil } from '@/components/chat/utils/formatTime';

export const useMessageUtils = () => {
  // Use the utility function
  const formatTime = (timestamp: string): string => {
    return formatTimeUtil(timestamp);
  };

  return {
    formatTime,
  };
};
