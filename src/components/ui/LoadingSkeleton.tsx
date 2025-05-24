
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'default' | 'card' | 'list' | 'detail' | 'grid';
  count?: number;
  className?: string;
}

const SkeletonLine = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse bg-muted rounded', className)} />
);

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'default',
  count = 1,
  className
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-4">
            <SkeletonLine className="h-48 w-full" />
            <div className="space-y-2">
              <SkeletonLine className="h-4 w-3/4" />
              <SkeletonLine className="h-4 w-1/2" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <SkeletonLine className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <SkeletonLine className="h-4 w-1/2" />
                <SkeletonLine className="h-3 w-1/3" />
              </div>
            </div>
          </div>
        );

      case 'detail':
        return (
          <div className="space-y-6">
            <SkeletonLine className="h-8 w-2/3" />
            <div className="flex items-center space-x-4">
              <SkeletonLine className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="h-3 w-16" />
              </div>
            </div>
            <div className="space-y-3">
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-full" />
              <SkeletonLine className="h-4 w-3/4" />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <SkeletonLine className="h-32 w-full" />
                <div className="space-y-2">
                  <SkeletonLine className="h-4 w-3/4" />
                  <SkeletonLine className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-3/4" />
            <SkeletonLine className="h-4 w-1/2" />
          </div>
        );
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {variant === 'grid' ? (
        renderSkeleton()
      ) : (
        Array(count).fill(0).map((_, i) => (
          <div key={i} className={cn('w-full', i > 0 && 'mt-6')}>
            {renderSkeleton()}
          </div>
        ))
      )}
    </div>
  );
};
