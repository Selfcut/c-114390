
import { useCallback } from 'react';
import { format, isValid, parseISO } from 'date-fns';

export const useMessageUtils = () => {
  const formatTime = useCallback((timestamp: string) => {
    if (!timestamp) return 'Just now';
    
    try {
      // First try parsing as ISO string for maximum compatibility
      let date: Date;
      
      if (typeof timestamp === 'string') {
        // Try parseISO first, which handles ISO strings better
        date = parseISO(timestamp);
        
        // If that fails, fallback to new Date()
        if (!isValid(date)) {
          date = new Date(timestamp);
        }
      } else {
        // If it's already a Date object
        date = timestamp as unknown as Date;
      }
      
      // Double check if the date is valid before formatting
      if (!isValid(date)) {
        console.error('Invalid date after parsing:', timestamp);
        return 'Just now';
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
      console.error('Error formatting date:', error, timestamp);
      return 'Just now';
    }
  }, []);
  
  return { formatTime };
};
