
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export const ResearchLoadingIndicator: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden border border-border flex flex-col">
          <Skeleton className="aspect-video w-full" />
          <CardHeader className="py-3 px-4 space-y-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="py-2 px-4">
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4" />
          </CardContent>
          <CardFooter className="py-3 px-4 border-t flex justify-between mt-auto">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-3 w-16" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
