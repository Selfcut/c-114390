
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewMode } from './ViewSwitcher';
import { cn } from '@/lib/utils';

interface ContentFeedSkeletonProps {
  count?: number;
  viewMode: ViewMode;
}

export const ContentFeedSkeleton: React.FC<ContentFeedSkeletonProps> = ({ 
  count = 6,
  viewMode 
}) => {
  const isGrid = viewMode === 'grid';
  const isList = viewMode === 'list';
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={cn(
          "overflow-hidden",
          isList && "flex flex-row"
        )}>
          {/* Image skeleton */}
          {(isGrid || isList) && (
            <div className={cn(
              isGrid && "w-full h-40",
              isList && "w-32 h-auto"
            )}>
              <Skeleton className="w-full h-full" />
            </div>
          )}
          
          {/* Content */}
          <div className={cn("flex flex-col", isList && "flex-1")}>
            <CardContent className={cn("p-4", isList && "pb-0")}>
              {/* Type badge */}
              <Skeleton className="h-6 w-20 mb-2 rounded-full" />
              
              {/* Title */}
              <Skeleton className="h-6 w-3/4 mb-2" />
              
              {/* Description */}
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              
              {/* Tags */}
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-2 border-t flex justify-between items-center mt-auto">
              <Skeleton className="h-4 w-32" />
              
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            </CardFooter>
          </div>
        </Card>
      ))}
    </>
  );
};
