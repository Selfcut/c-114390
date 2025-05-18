
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from './UserMenu';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Button } from '@/components/ui/button';
import { HelpCircle, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const HeaderActions = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-1">
      {/* Discord button with proper icon */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-1" 
        aria-label="Discord"
        onClick={() => window.open('https://disboard.org/server/discord-server-id', '_blank')}
      >
        <img 
          src="/lovable-uploads/de52f1ad-3a44-4bde-8e0c-19b2e6964456.png" 
          alt="Discord" 
          className="w-5 h-5" 
        />
        <span className="sr-only">Discord</span>
      </Button>
      
      {/* Premium button with Star icon */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-1 text-amber-500" 
        aria-label="Premium"
        onClick={() => window.location.href = '/premium'}
      >
        <Star size={20} />
        <span className="sr-only">Premium</span>
      </Button>
      
      {/* Help button with dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-1" aria-label="Help">
            <HelpCircle size={20} />
            <span className="sr-only">Help</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => window.location.href = '/faq'}>
              FAQ
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/tutorials'}>
              Tutorials
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/support'}>
              Contact Support
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open('https://docs.polymath.network', '_blank')}>
              Documentation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ThemeToggle />
      {user && <NotificationsDropdown />}
      <UserMenu />
    </div>
  );
};
