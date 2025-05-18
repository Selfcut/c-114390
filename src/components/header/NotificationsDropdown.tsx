
import React, { useState, useEffect, useCallback } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export interface Notification {
  id: string;
  type: 'mention' | 'reply' | 'like' | 'system';
  content: string;
  isRead: boolean;
  timestamp: Date;
  linkTo?: string; // Optional link to navigate to
}

// Create a shared mock notification data function to ensure consistency
export const getMockNotifications = (): Notification[] => {
  return [
    {
      id: 'notif1',
      type: 'mention',
      content: 'PhilosophyLover mentioned you in Systems Thinking discussion',
      isRead: false,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      linkTo: '/forum/systems-thinking'
    },
    {
      id: 'notif2',
      type: 'reply',
      content: 'WisdomSeeker replied to your comment',
      isRead: false,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      linkTo: '/forum/wisdom'
    },
    {
      id: 'notif3',
      type: 'like',
      content: 'KnowledgeExplorer liked your quote',
      isRead: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      linkTo: '/quotes'
    },
    {
      id: 'notif4',
      type: 'system',
      content: 'Welcome to Polymath! Complete your profile to get started.',
      isRead: true,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      linkTo: '/profile'
    },
    {
      id: 'notif5',
      type: 'mention',
      content: 'AristotleFan mentioned you in Philosophy discussion',
      isRead: false,
      timestamp: new Date(Date.now() - 40 * 60 * 1000), // 40 mins ago
      linkTo: '/forum/philosophy'
    },
    {
      id: 'notif6',
      type: 'system',
      content: 'Your weekly learning summary is ready to view',
      isRead: false,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      linkTo: '/dashboard'
    }
  ];
};

export const formatNotificationTime = (timestamp: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 24 * 60) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / (60 * 24))}d ago`;
  }
};

export const NotificationsDropdown = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Memoize the fetch notifications function
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // In a real app, we would fetch notifications from Supabase
      // For now, we'll use mock data
      const mockNotifications = getMockNotifications().slice(0, 4); // Show fewer in dropdown
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchNotifications();
    
    // Set up a realtime subscription for new notifications
    let channel;
    if (user && user.id) {
      console.log('Setting up notifications channel for user:', user.id);
      channel = supabase
        .channel(`notifications-${user.id}`)
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('New notification received:', payload);
            
            // In a real app, we would parse the notification from payload
            // For this demo, we'll add a mock notification
            const newNotification: Notification = {
              id: `notif-${Date.now()}`,
              type: 'system',
              content: 'You received a new notification',
              isRead: false,
              timestamp: new Date()
            };
            
            setNotifications(prevNotifications => 
              [newNotification, ...prevNotifications]
            );
            
            // Show a toast notification
            toast({
              title: "New notification",
              description: newNotification.content,
            });
          })
        .subscribe((status) => {
          console.log('Notification channel status:', status);
        });
    }
    
    return () => {
      if (channel) {
        console.log('Cleaning up notifications channel');
        supabase.removeChannel(channel);
      }
    };
  }, [user, toast, fetchNotifications]);
  
  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
    
    toast({
      description: "All notifications marked as read",
    });
  }, [toast]);

  const handleNotificationClick = useCallback((notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    
    // Navigate if there's a link
    if (notification.linkTo) {
      navigate(notification.linkTo);
    }
    
    // Close dropdown (will happen automatically due to clicking)
  }, [notifications, navigate]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-accent hover:text-accent-foreground" aria-label="Notifications">
          <Bell size={20} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping absolute"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadNotificationsCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto text-xs px-2 py-1"
              onClick={markAllNotificationsAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="py-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-6 px-2 text-center">
            <div className="flex justify-center mb-2">
              <Bell className="h-12 w-12 text-muted-foreground opacity-20" />
            </div>
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`px-4 py-3 hover:bg-accent/50 cursor-pointer ${!notification.isRead ? 'bg-accent/20' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.type === 'mention' && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <span className="text-xs font-medium text-blue-500 dark:text-blue-200">@</span>
                      </span>
                    )}
                    {notification.type === 'reply' && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <span className="text-xs font-medium text-green-500 dark:text-green-200">↩</span>
                      </span>
                    )}
                    {notification.type === 'like' && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                        <span className="text-xs font-medium text-red-500 dark:text-red-200">♥</span>
                      </span>
                    )}
                    {notification.type === 'system' && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                        <span className="text-xs font-medium text-purple-500 dark:text-purple-200">!</span>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatNotificationTime(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/notifications')}>
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
