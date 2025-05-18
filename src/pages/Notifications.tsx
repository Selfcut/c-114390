
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMockNotifications, formatNotificationTime, Notification } from "@/components/header/NotificationsDropdown";

const Notifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, we would fetch notifications from Supabase
        // For now, we'll use mock data
        const mockNotifications = getMockNotifications();
        
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
    
    toast({
      description: "All notifications marked as read",
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'mention':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="text-lg font-medium text-blue-500 dark:text-blue-200">@</span>
          </span>
        );
      case 'reply':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <span className="text-lg font-medium text-green-500 dark:text-green-200">↩</span>
          </span>
        );
      case 'like':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <span className="text-lg font-medium text-red-500 dark:text-red-200">♥</span>
          </span>
        );
      case 'system':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <span className="text-lg font-medium text-purple-500 dark:text-purple-200">!</span>
          </span>
        );
      default:
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </span>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
                : 'No unread notifications'
              }
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <Check size={16} />
              <span>Mark all as read</span>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`
                  flex items-start gap-4 p-4 rounded-lg border
                  ${notification.isRead ? 'bg-background' : 'bg-accent/10'}
                  cursor-pointer hover:bg-accent/20 transition-colors
                `}
                onClick={() => markAsRead(notification.id)}
              >
                {getNotificationIcon(notification.type)}
                
                <div className="flex-1">
                  <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatNotificationTime(notification.timestamp)}
                  </p>
                </div>
                
                {!notification.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <Bell size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium mb-1">No notifications yet</h3>
            <p className="text-muted-foreground">
              When you receive notifications, they will appear here.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Notifications;
