
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide"
        >
          <circle cx="9" cy="12" r="1"></circle>
          <circle cx="15" cy="12" r="1"></circle>
          <path d="M7.5 7.2A4.2 4.2 0 0 1 11.7 3h.6a4.2 4.2 0 0 1 4.2 4.2v.6a9 9 0 0 1-.9 3.9 9 9 0 0 1-2.6 2.7c-.5.3-.7.7-.8 1.1a1 1 0 0 1-.5.6.7.7 0 0 1-.7 0 1 1 0 0 1-.5-.6c-.1-.4-.3-.8-.8-1.1a9 9 0 0 1-2.6-2.7 9 9 0 0 1-.9-3.9v-.6z"></path>
          <path d="M8 15h8a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1a4 4 0 0 1 4-4zm8 0v4.8"></path>
        </svg>
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
