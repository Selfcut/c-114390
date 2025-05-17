
import React from 'react';
import { Button } from "@/components/ui/button";

export const GuestPrompt = () => {
  return (
    <div className="mt-8 border border-primary/20 bg-primary/5 rounded-lg p-6 text-center">
      <h3 className="text-lg font-medium mb-2">Join the conversation</h3>
      <p className="mb-4 text-muted-foreground">Sign in to create discussions and participate in the community.</p>
      <Button asChild>
        <a href="/auth">Sign In</a>
      </Button>
    </div>
  );
};
