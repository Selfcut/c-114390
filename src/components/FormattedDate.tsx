
import React from 'react';

interface FormattedDateProps {
  date: string | Date;
  format?: 'relative' | 'short' | 'long';
  className?: string;
}

export const FormattedDate: React.FC<FormattedDateProps> = ({ 
  date, 
  format = 'relative',
  className = ''
}) => {
  const formatDate = (dateInput: string | Date) => {
    try {
      const dateObj = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }

      const now = new Date();
      const diffInMs = now.getTime() - dateObj.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      switch (format) {
        case 'relative':
          if (diffInMinutes < 1) return 'Just now';
          if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
          if (diffInHours < 24) return `${diffInHours}h ago`;
          if (diffInDays < 7) return `${diffInDays}d ago`;
          return dateObj.toLocaleDateString();
          
        case 'short':
          return dateObj.toLocaleDateString([], { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
        case 'long':
          return dateObj.toLocaleDateString([], { 
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
        default:
          return dateObj.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <span className={className} title={new Date(date).toLocaleString()}>
      {formatDate(date)}
    </span>
  );
};
