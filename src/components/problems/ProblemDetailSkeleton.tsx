
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProblemDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-3/4">
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-5 w-full" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      {Array(2).fill(0).map((_, index) => (
        <Card key={`comment-skeleton-${index}`}>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
