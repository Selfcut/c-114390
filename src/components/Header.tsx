
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 h-16 border-b border-border sticky top-0 z-10 bg-background">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold mr-8">
          Wisdom
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/forum" className="text-sm hover:text-primary">Forum</Link>
          <Link to="/media" className="text-sm hover:text-primary">Media</Link>
          <Link to="/knowledge" className="text-sm hover:text-primary">Knowledge</Link>
          <Link to="/words" className="text-sm hover:text-primary">Words</Link>
          <Link to="/notes" className="text-sm hover:text-primary">Notes</Link>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
