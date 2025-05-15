
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/ThemeToggle';

import logo from '../../public/logo.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Polymath Logo" className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block">Polymath</span>
          </Link>
          <nav className="hidden gap-6 sm:flex">
            <Link
              to="/"
              className={`font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/forum"
              className={`font-medium transition-colors hover:text-primary ${
                location.pathname === "/forum" ? "text-primary" : "text-foreground"
              }`}
            >
              Forum
            </Link>
            <Link
              to="/library"
              className={`font-medium transition-colors hover:text-primary ${
                location.pathname === "/library" ? "text-primary" : "text-foreground"
              }`}
            >
              Library
            </Link>
            <Link
              to="/quotes"
              className={`font-medium transition-colors hover:text-primary ${
                location.pathname === "/quotes" ? "text-primary" : "text-foreground"
              }`}
            >
              Quotes
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* Theme toggle */}
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className="w-9 px-0"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            
            <Button
              variant="ghost" 
              size="icon"
              aria-label="Notifications"
              className="w-9 px-0"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
