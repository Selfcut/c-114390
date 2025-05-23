
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewMode } from './ViewSwitcher';

interface ContentFeedSkeletonProps {
  viewMode: ViewMode;
  count?: number;
}

export const ContentFeedSkeleton: React.FC<ContentFeedSkeletonProps> = ({ 
  viewMode, 
  count = 6 
}) => {
  const items = Array.from({ length: count }, (_, i) => i);
  
  if (viewMode === 'grid') {
    return (
      <>
        {items.map((item) => (
          <div key={item} className="flex flex-col gap-2">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="flex justify-between mt-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </>
    );
  }
  
  return (
    <>
      {items.map((item) => (
        <div key={item} className="flex gap-4">
          <Skeleton className="h-20 w-20 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
