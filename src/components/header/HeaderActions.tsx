
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HelpCircle, Crown, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenu } from "./UserMenu";
import { MakeAdminButton } from "@/components/admin/MakeAdminButton";

export const HeaderActions = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {/* Discord Icon */}
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-accent hover:text-accent-foreground"
        aria-label="Discord Community"
        asChild
      >
        <a href="https://disboard.org/server/597688497599545364" target="_blank" rel="noopener noreferrer">
          <img 
            src="/lovable-uploads/fab013d4-833b-4739-a13d-9492c0dea259.png" 
            alt="Discord" 
            className="w-5 h-5" 
          />
        </a>
      </Button>
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Notifications - Ensure it's always displayed */}
      <NotificationsDropdown />
      
      {/* Admin Button - Only show for non-admin users with email containing "polymath" */}
      {user && user.email && !user.isAdmin && (
        <MakeAdminButton />
      )}
      
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
          <DropdownMenuItem asChild>
            <Link to="/help/getting-started">Getting Started</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/help/documentation">Documentation</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/help/shortcuts">Keyboard Shortcuts</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/help/issue">Report an Issue</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/help/support">Contact Support</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* User Menu */}
      <UserMenu />
    </div>
  );
};
