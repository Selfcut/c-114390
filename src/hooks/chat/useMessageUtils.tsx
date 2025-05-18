
import { useCallback } from 'react';
import { format } from 'date-fns';

export const useMessageUtils = () => {
  const formatTime = useCallback((timestamp: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
    
    if (isToday) {
      return format(date, 'HH:mm');
    }
    
    return format(date, 'MMM dd, HH:mm');
  }, []);
  
  return { formatTime };
};
