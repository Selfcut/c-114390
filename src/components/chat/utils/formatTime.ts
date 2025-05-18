
/**
 * Format a timestamp into a human-readable time string
 */
export const formatTime = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Just now';
    }
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    return 'Just now';
  }
};
