
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from './UserMenu';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Button } from '@/components/ui/button';
import { HelpCircle, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export const HeaderActions = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="icon" className="mr-1" aria-label="Discord">
        <MessageSquare size={20} />
        <span className="sr-only">Discord</span>
      </Button>
      
      <Button variant="ghost" size="icon" className="mr-1" aria-label="Premium">
        <Star size={20} />
        <span className="sr-only">Premium</span>
      </Button>
      
      <Button variant="ghost" size="icon" className="mr-1" aria-label="Help">
        <HelpCircle size={20} />
        <span className="sr-only">Help</span>
      </Button>
      
      <ThemeToggle />
      {user && <NotificationsDropdown />}
      <UserMenu />
    </div>
  );
};
