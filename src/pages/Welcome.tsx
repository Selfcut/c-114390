
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

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
      </div>
    </div>
  );
};

export default Welcome;
