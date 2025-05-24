
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';

export interface Notification {
  id: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'mention' | 'reply' | 'like' | 'system';
}

export const getMockNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      content: 'Someone mentioned you in a discussion about philosophy',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      type: 'mention'
    },
    {
      id: '2',
      content: 'Your quote received 5 new likes',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: false,
      type: 'like'
    },
    {
      id: '3',
      content: 'New reply to your forum post',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isRead: true,
      type: 'reply'
    },
    {
      id: '4',
      content: 'System maintenance scheduled for tonight',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      type: 'system'
    }
  ];
};

export const formatNotificationTime = (timestamp: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - timestamp.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return timestamp.toLocaleDateString();
  }
};

export const NotificationsDropdown = () => {
  const notifications = getMockNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
              <div className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                {notification.content}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatNotificationTime(notification.timestamp)}
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>
            <div className="text-sm text-muted-foreground">
              No new notifications
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
