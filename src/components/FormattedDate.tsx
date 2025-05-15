
import { formatDistanceToNow, format, isToday, isYesterday, isThisYear } from 'date-fns';

interface FormattedDateProps {
  date: Date;
  format?: 'relative' | 'standard' | 'full';
  className?: string;
}

export const FormattedDate = ({ 
  date, 
  format: formatType = 'relative',
  className 
}: FormattedDateProps) => {
  if (!date) return null;

  let formattedDate: string;

  switch (formatType) {
    case 'relative':
      formattedDate = formatRelative(date);
      break;
    case 'standard':
      formattedDate = formatStandard(date);
      break;
    case 'full':
      formattedDate = formatFull(date);
      break;
    default:
      formattedDate = formatRelative(date);
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
