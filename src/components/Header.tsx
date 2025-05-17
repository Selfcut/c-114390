
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, Search, HelpCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserMenu } from '@/components/header/UserMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background sticky top-0 z-10">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search..."
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </Button>
          
          {/* Help Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Help">
                <HelpCircle size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Getting Started</DropdownMenuItem>
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>FAQ</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Contact Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
