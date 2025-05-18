
/**
 * Format a timestamp into a human-readable time string
 */
export const formatTime = (timestamp: string | Date) => {
  try {
    // If the timestamp is already a Date object, use it directly
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format received:", timestamp);
      return 'Just now';
    }
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error("Error formatting time:", error, timestamp);
    return 'Just now';
  }
};
