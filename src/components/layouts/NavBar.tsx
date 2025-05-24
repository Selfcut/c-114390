
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { HeaderActions } from '@/components/header/HeaderActions';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';

export const NavBar: React.FC = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useLayout();

  // Only show sidebar toggle on app pages (when user is authenticated and layout context exists)
  const showSidebarToggle = user && toggleSidebar;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <span className="font-bold text-lg">Polymath</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};
