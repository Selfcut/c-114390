
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ProblemNotFoundProps {
  onBackClick: () => void;
}

export const ProblemNotFound = ({ onBackClick }: ProblemNotFoundProps) => {
  return (
    <Card className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-muted p-4">
          <AlertTriangle size={32} className="text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">Problem Not Found</h3>
      <p className="text-muted-foreground mb-4">The problem you're looking for doesn't exist or has been removed</p>
      <Button onClick={onBackClick}>Return to Problems Directory</Button>
    </Card>
  );
};
