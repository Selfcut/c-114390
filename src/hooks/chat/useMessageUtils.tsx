
import { useCallback } from 'react';
import { format, isValid } from 'date-fns';

export const useMessageUtils = () => {
  const formatTime = useCallback((timestamp: string) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      
      // Check if the date is valid before formatting
      if (!isValid(date)) {
        console.error('Invalid date:', timestamp);
        return 'Invalid date';
      }
      
      const now = new Date();
      const isToday = date.getDate() === now.getDate() &&
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear();
      
      if (isToday) {
        return format(date, 'HH:mm');
      }
      
      return format(date, 'MMM dd, HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }, []);
  
  return { formatTime };
};
