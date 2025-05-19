
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft } from 'lucide-react';

interface ProblemNotFoundProps {
  onBackClick: () => void;
}

export const ProblemNotFound = ({ onBackClick }: ProblemNotFoundProps) => {
  return (
    <Card className="text-center py-8">
      <CardContent className="pb-2">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Search size={32} className="text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          We couldn't find the problem you're looking for. It may have been removed or you might have followed an incorrect link.
        </p>
      </CardContent>
      <CardFooter className="justify-center pt-2">
        <Button onClick={onBackClick} className="flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Return to Problems Directory
        </Button>
      </CardFooter>
    </Card>
  );
};
