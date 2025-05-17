
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface EmptyCommentsProps {
  isAuthenticated: boolean;
}

export const EmptyComments = ({ isAuthenticated }: EmptyCommentsProps) => {
  return (
    <Card className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-muted p-4">
          <MessageSquare size={32} className="text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">No Comments Yet</h3>
      <p className="text-muted-foreground mb-4">Be the first to share your thoughts</p>
      {!isAuthenticated && (
        <Button asChild>
          <a href="/auth">Sign In to Comment</a>
        </Button>
      )}
    </Card>
  );
};
