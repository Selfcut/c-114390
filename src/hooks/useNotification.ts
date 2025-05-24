
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  title?: string;
  description: string;
  type: NotificationType;
  duration?: number;
}

export const useNotification = () => {
  const { toast } = useToast();

  const notify = useCallback((options: NotificationOptions) => {
    const { title, description, type, duration = 5000 } = options;
    
    toast({
      title: title || getDefaultTitle(type),
      description,
      variant: type === 'error' ? 'destructive' : 'default',
      duration,
    });
  }, [toast]);

  const success = useCallback((description: string, title?: string) => {
    notify({ type: 'success', description, title });
  }, [notify]);

  const error = useCallback((description: string, title?: string) => {
    notify({ type: 'error', description, title });
  }, [notify]);

  const warning = useCallback((description: string, title?: string) => {
    notify({ type: 'warning', description, title });
  }, [notify]);

  const info = useCallback((description: string, title?: string) => {
    notify({ type: 'info', description, title });
  }, [notify]);

  return {
    notify,
    success,
    error,
    warning,
    info
  };
};

const getDefaultTitle = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    case 'info':
      return 'Information';
    default:
      return '';
  }
};
