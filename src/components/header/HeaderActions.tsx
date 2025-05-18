
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
      {/* Discord button with proper linking */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-1" 
        aria-label="Discord"
        onClick={() => window.open('https://discord.gg/polymath', '_blank')}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="lucide lucide-message-square"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span className="sr-only">Discord</span>
      </Button>
      
      {/* Premium button with Star icon */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-1" 
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
