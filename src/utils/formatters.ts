
import { formatDistanceToNow, format } from 'date-fns';

// Format time to relative format (e.g., "2 hours ago")
export const formatTimeAgo = (timestamp: string): string => {
  if (!timestamp) return '';
  
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid date';
  }
};

// Format date to standard format (e.g., "Jan 15, 2023")
export const formatDate = (timestamp: string): string => {
  if (!timestamp) return '';
  
  try {
    return format(new Date(timestamp), 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format date and time (e.g., "Jan 15, 2023 at 14:30")
export const formatDateTime = (timestamp: string): string => {
  if (!timestamp) return '';
  
  try {
    return format(new Date(timestamp), 'MMM d, yyyy \'at\' HH:mm');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
};
