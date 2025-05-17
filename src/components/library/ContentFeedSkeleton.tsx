
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentFeedSkeletonProps {
  viewMode: 'grid' | 'list' | 'feed';
}

export const ContentFeedSkeleton: React.FC<ContentFeedSkeletonProps> = ({ viewMode }) => {
  const skeletonCount = viewMode === 'grid' ? 6 : 3;
  
  if (viewMode === 'grid') {
    return (
      <>
        {[...Array(skeletonCount)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-full mt-2" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-1 mt-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col gap-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </>
    );
  }

  return (
    <div className="w-full space-y-4">
      {[...Array(skeletonCount)].map((_, index) => (
        <Card key={index} className="w-full overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <Skeleton className="h-40 md:w-48 w-full" />
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-full mt-2" />
              <Skeleton className="h-4 w-full my-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              
              <div className="flex gap-1 mt-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
