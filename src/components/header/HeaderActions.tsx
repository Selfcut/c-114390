
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from './UserMenu';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Button } from '@/components/ui/button';
import { HelpCircle, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export const HeaderActions = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-1">
      {/* Premium button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-1 text-amber-500 hover:text-amber-600 hover:bg-accent transition-colors" 
        aria-label="Premium"
        title="Premium Features"
      >
        <Star size={20} />
        <span className="sr-only">Premium</span>
      </Button>
      
      {/* Help button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-1 hover:bg-accent hover:text-accent-foreground transition-colors" 
        aria-label="Help"
        title="Help & Support"
      >
        <HelpCircle size={20} />
        <span className="sr-only">Help</span>
      </Button>
      
      <ThemeToggle />
      {user && <NotificationsDropdown />}
      <UserMenu />
    </div>
  );
};
