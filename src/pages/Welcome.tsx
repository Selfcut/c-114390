
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center max-w-3xl">
        <img src="/logo.svg" alt="Polymath Logo" className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Welcome to Polymath</h1>
        <p className="text-xl text-muted-foreground mb-8">
          An intellectual science community for collaborative learning and knowledge sharing.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button asChild size="lg">
            <Link to="/auth">Join Now</Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link to="/auth?tab=login">Sign In</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-2">Connect</h2>
            <p className="text-muted-foreground">Join discussions with fellow intellectuals across various disciplines.</p>
          </div>
          
          <div className="p-4">
            <h2 className="text-lg font-medium mb-2">Learn</h2>
            <p className="text-muted-foreground">Access a comprehensive library of academic resources and knowledge entries.</p>
          </div>
          
          <div className="p-4">
            <h2 className="text-lg font-medium mb-2">Contribute</h2>
            <p className="text-muted-foreground">Share your insights and help build a collaborative knowledge base.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
