
/**
 * Format a timestamp into a human-readable time string
 */
export const formatTime = (timestamp: string | Date) => {
  try {
    // Handle undefined or null case
    if (!timestamp) {
      return 'Just now';
    }
    
    // If the timestamp is already a Date object, use it directly
    let date: Date;
    
    if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      // Handle ISO strings and other timestamp formats
      if (typeof timestamp === 'string') {
        if (timestamp.toLowerCase() === 'invalid date') {
          return 'Just now';
        }
        
        // Try parsing the date string
        date = new Date(timestamp);
      } else {
        return 'Just now';
      }
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format received:", timestamp);
      return 'Just now';
    }
    
    // Check if the date is today
    const now = new Date();
    const today = now.toDateString() === date.toDateString();
    
    // Format the date as a time string
    if (today) {
      // For today's messages, just show the time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // For older messages, include the date
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      }) + ' at ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  } catch (error) {
    console.error("Error formatting time:", error, timestamp);
    return 'Just now';
  }
};
