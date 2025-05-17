
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NotFoundCardProps {
  onNavigateBack: () => void;
}

export const NotFoundCard = ({ onNavigateBack }: NotFoundCardProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-red-500">Discussion not found or has been removed.</p>
        <Button 
          className="mt-4"
          onClick={onNavigateBack}
        >
          Back to Forum
        </Button>
      </CardContent>
    </Card>
  );
};
