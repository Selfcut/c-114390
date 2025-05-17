
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ForumSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
};
