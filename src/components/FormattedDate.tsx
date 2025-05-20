
import { formatDistanceToNow, format, isToday, isYesterday, isThisYear, isValid } from 'date-fns';

interface FormattedDateProps {
  date: Date | string;
  format?: 'relative' | 'standard' | 'full';
  className?: string;
  fallback?: string;
}

export const FormattedDate = ({ 
  date, 
  format: formatType = 'relative',
  className,
  fallback = 'Invalid date'
}: FormattedDateProps) => {
  // First ensure we have a valid Date object
  const ensureDate = (input: Date | string): Date | null => {
    if (!input) return null;
    
    try {
      const dateObj = input instanceof Date ? input : new Date(input);
      return isValid(dateObj) ? dateObj : null;
    } catch (error) {
      console.error("Invalid date input:", input, error);
      return null;
    }
  };
  
  const validDate = ensureDate(date);
  if (!validDate) return <span className={className}>{fallback}</span>;

  let formattedDate: string;

  switch (formatType) {
    case 'relative':
      formattedDate = formatRelative(validDate);
      break;
    case 'standard':
      formattedDate = formatStandard(validDate);
      break;
    case 'full':
      formattedDate = formatFull(validDate);
      break;
    default:
      formattedDate = formatRelative(validDate);
  }

  return <span className={className}>{formattedDate}</span>;
};

// Helper functions for formatting dates
function formatRelative(date: Date): string {
  try {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else if (Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      // Less than 7 days ago
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (isThisYear(date)) {
      // This year but more than 7 days ago
      return format(date, 'MMM d');
    } else {
      // Previous years
      return format(date, 'MMM d, yyyy');
    }
  } catch (error) {
    console.error("Date formatting error:", error);
    return 'Invalid date';
  }
}

function formatStandard(date: Date): string {
  try {
    if (isThisYear(date)) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MMM d, yyyy');
    }
  } catch (error) {
    console.error("Date formatting error:", error);
    return 'Invalid date';
  }
}

function formatFull(date: Date): string {
  try {
    return format(date, 'MMMM d, yyyy \'at\' h:mm a');
  } catch (error) {
    console.error("Date formatting error:", error);
    return 'Invalid date';
  }
}
