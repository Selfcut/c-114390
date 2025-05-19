
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { CalendarIcon, MessageSquareText, BookOpen, Quote } from 'lucide-react';

const Welcome = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to Polymath
        </h1>
        
        <p className="text-xl text-muted-foreground">
          A community platform for intellectual exploration and knowledge sharing.
        </p>
        
        {/* Main Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {isAuthenticated ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/auth?tab=signup">Create Account</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Link to="/events" className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border">
            <CalendarIcon className="h-8 w-8 mb-3 text-primary" />
            <h2 className="text-lg font-semibold mb-2">Events</h2>
            <p className="text-sm text-muted-foreground">Discover and attend intellectual events</p>
          </Link>
          
          <Link to="/forum" className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border">
            <MessageSquareText className="h-8 w-8 mb-3 text-primary" />
            <h2 className="text-lg font-semibold mb-2">Forum</h2>
            <p className="text-sm text-muted-foreground">Join thoughtful discussions</p>
          </Link>
          
          <Link to="/library" className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border">
            <BookOpen className="h-8 w-8 mb-3 text-primary" />
            <h2 className="text-lg font-semibold mb-2">Library</h2>
            <p className="text-sm text-muted-foreground">Access curated knowledge resources</p>
          </Link>
          
          <Link to="/quotes" className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border">
            <Quote className="h-8 w-8 mb-3 text-primary" />
            <h2 className="text-lg font-semibold mb-2">Quotes</h2>
            <p className="text-sm text-muted-foreground">Discover wisdom from great minds</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
