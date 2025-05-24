
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentViewMode } from '@/types/unified-content-types';

interface ContentFeedSkeletonProps {
  viewMode: ContentViewMode;
  count?: number;
}

export const ContentFeedSkeleton: React.FC<ContentFeedSkeletonProps> = ({ 
  viewMode, 
  count = 6 
}) => {
  const getContainerClass = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'list':
        return 'space-y-4';
      case 'feed':
        return 'space-y-6 max-w-2xl mx-auto';
      default:
        return 'space-y-4';
    }
  };

  return (
    <div className={getContainerClass()}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 w-16" />
            </div>
            
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <div className="flex items-center gap-4 w-full">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-8 ml-auto" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
