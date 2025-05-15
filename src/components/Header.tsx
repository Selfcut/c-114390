import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { UserHoverCard } from "./UserHoverCard";
import { GlobalSearch } from "./GlobalSearch";
import {
  Bell,
  HelpCircle,
  Crown,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="container px-4 h-16 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md mr-4">
          <GlobalSearch />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ModeToggle />
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-accent hover:text-accent-foreground" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Chat */}
          <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground" aria-label="Chat" asChild>
            <Link to="/chat">
              <MessageSquare size={20} />
            </Link>
          </Button>
          
          {/* Premium */}
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1 text-amber-500 border-amber-500/30 hover:bg-amber-500/10">
            <Crown size={14} />
            <span className="text-xs">Premium</span>
          </Button>
          
          {/* Help */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground" aria-label="Help">
                <HelpCircle size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem>Getting Started</DropdownMenuItem>
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report an Issue</DropdownMenuItem>
              <DropdownMenuItem>Contact Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <UserHoverCard 
                  username={user.name.toLowerCase().replace(/\s+/g, '')}
                  avatar={user.avatar}
                  isOnline={user.status === "online"}
                  displayName={user.name}
                >
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </UserHoverCard>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" asChild>
              <Link to="/auth">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
