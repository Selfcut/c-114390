
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface NotFoundCardProps {
  onNavigateBack: () => void;
}

export const NotFoundCard = ({ onNavigateBack }: NotFoundCardProps) => {
  return (
    <Card className="border-destructive/20">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-2" />
        <h3 className="text-lg font-semibold mb-2">Discussion Not Found</h3>
        <p className="text-muted-foreground mb-4">
          This discussion doesn't exist or has been removed.
        </p>
        <Button 
          variant="outline"
          onClick={onNavigateBack}
        >
          Back to Forum
        </Button>
      </CardContent>
    </Card>
  );
};
