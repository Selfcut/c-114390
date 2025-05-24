
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, Library, Book, Youtube, FileText } from 'lucide-react';

export const NavBar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/forum", icon: MessageSquare, label: "Forum" },
    { path: "/library", icon: Library, label: "Library" },
    { path: "/wiki", icon: Book, label: "Wiki" },
    { path: "/media", icon: Youtube, label: "Media" },
    { path: "/quotes", icon: FileText, label: "Quotes" },
  ];

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl">
            Polymath
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
