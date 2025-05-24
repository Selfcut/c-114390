
import { format, formatDistance, isValid, parseISO } from 'date-fns';

export const formatDate = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return 'Unknown date';
  
  let date: Date;
  
  if (typeof dateInput === 'string') {
    date = parseISO(dateInput);
  } else {
    date = dateInput;
  }
  
  if (!isValid(date)) return 'Invalid date';
  
  return format(date, 'MMM d, yyyy');
};

export const formatDateTime = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return 'Unknown date';
  
  let date: Date;
  
  if (typeof dateInput === 'string') {
    date = parseISO(dateInput);
  } else {
    date = dateInput;
  }
  
  if (!isValid(date)) return 'Invalid date';
  
  return format(date, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (dateInput: string | Date | null | undefined): string => {
  if (!dateInput) return 'Unknown time';
  
  let date: Date;
  
  if (typeof dateInput === 'string') {
    date = parseISO(dateInput);
  } else {
    date = dateInput;
  }
  
  if (!isValid(date)) return 'Invalid time';
  
  return formatDistance(date, new Date(), { addSuffix: true });
};

export const isValidDateString = (dateString: string): boolean => {
  return isValid(parseISO(dateString));
};
