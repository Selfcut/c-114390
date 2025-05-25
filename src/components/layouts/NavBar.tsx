
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { HeaderActions } from '@/components/header/HeaderActions';
import { HeaderLogo } from '@/components/header/HeaderLogo';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';

export const NavBar: React.FC = () => {
  const { user } = useAuth();
  const layoutContext = useLayout();

  // Only show sidebar toggle on app pages (when user is authenticated and layout context exists)
  const showSidebarToggle = user && layoutContext;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={layoutContext.toggleSidebar}
              className="mr-3 nav-button hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <Link 
            to={user ? "/dashboard" : "/"} 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <HeaderLogo />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Polymath
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};
