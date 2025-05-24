
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Polymath
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex items-center">
            <HeaderActions />
          </nav>
        </div>
      </div>
    </header>
  );
};
