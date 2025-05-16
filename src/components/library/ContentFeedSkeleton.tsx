
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentFeedSkeletonProps {
  count?: number;
  viewMode: 'grid' | 'list' | 'feed';
}

export const ContentFeedSkeleton: React.FC<ContentFeedSkeletonProps> = ({ 
  count = 6, 
  viewMode 
}) => {
  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
      : "space-y-4"}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-video w-full bg-muted" />
          <div className="p-4">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center mt-4">
              <Skeleton className="h-8 w-8 rounded-full mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
