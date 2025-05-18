
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from './UserMenu';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export const HeaderActions = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="icon" className="mr-1">
        <Search size={20} />
        <span className="sr-only">Search</span>
      </Button>
      <ThemeToggle />
      {user && <NotificationsDropdown />}
      <UserMenu />
    </div>
  );
};
