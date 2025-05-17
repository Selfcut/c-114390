
import React, { useState } from "react";
import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Mock notifications - in a real app, these would come from an API or database
const mockNotifications = [
  {
    id: 'notif1',
    type: 'mention',
    content: 'PhilosophyLover mentioned you in Systems Thinking discussion',
    isRead: false,
    timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 mins ago
  },
  {
    id: 'notif2',
    type: 'reply',
    content: 'WisdomSeeker replied to your comment',
    isRead: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
  },
  {
    id: 'notif3',
    type: 'like',
    content: 'KnowledgeExplorer liked your quote',
    isRead: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 'notif4',
    type: 'system',
    content: 'Welcome to Polymath! Complete your profile to get started.',
    isRead: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  }
];

export const NotificationsDropdown = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markAllNotificationsAsRead = () => {
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

  const formatNotificationTime = (timestamp: Date) => {
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
        {notifications.length === 0 ? (
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
                onClick={() => {
                  const updatedNotifications = notifications.map(n => 
                    n.id === notification.id ? { ...n, isRead: true } : n
                  );
                  setNotifications(updatedNotifications);
                  // Handle notification click
                  toast({
                    description: "Navigating to notification content",
                  });
                }}
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
                        <MessageSquare className="h-3 w-3 text-green-500 dark:text-green-200" />
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
          <Button variant="outline" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
