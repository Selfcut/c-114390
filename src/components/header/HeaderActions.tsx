
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { HelpCircle, Crown, MessageSquare } from "lucide-react";
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

export const HeaderActions = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <ModeToggle />
      
      {/* Notifications - Only show for logged in users */}
      {user && <NotificationsDropdown />}

      {/* Chat - Only show for logged in users */}
      {user && (
        <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground" aria-label="Chat" asChild>
          <Link to="/chat">
            <MessageSquare size={20} />
          </Link>
        </Button>
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
          <DropdownMenuItem>Getting Started</DropdownMenuItem>
          <DropdownMenuItem>Documentation</DropdownMenuItem>
          <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Report an Issue</DropdownMenuItem>
          <DropdownMenuItem>Contact Support</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* User Menu */}
      <UserMenu />
    </div>
  );
};
