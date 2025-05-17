
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface PostNotFoundProps {
  onBack: () => void;
}

export const PostNotFound = ({ onBack }: PostNotFoundProps) => {
  return (
    <Card className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-muted p-4">
          <MessageSquare size={32} className="text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">Discussion Not Found</h3>
      <p className="text-muted-foreground mb-4">The discussion post you're looking for doesn't exist or has been removed</p>
      <Button onClick={onBack}>Return to Forum</Button>
    </Card>
  );
};
