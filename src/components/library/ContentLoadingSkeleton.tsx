
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentViewMode } from '@/types/unified-content-types';

interface ContentLoadingSkeletonProps {
  viewMode: ContentViewMode;
  count?: number;
}

export const ContentLoadingSkeleton: React.FC<ContentLoadingSkeletonProps> = ({ 
  viewMode, 
  count = 6 
}) => {
  const containerClassName = viewMode === 'grid' 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
    : "space-y-4";

  return (
    <div className={containerClassName}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          {viewMode === 'grid' && (
            <div className="aspect-video bg-gray-200 rounded-t-lg" />
          )}
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2 mb-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 mb-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
