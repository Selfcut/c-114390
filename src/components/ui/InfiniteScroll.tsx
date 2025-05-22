
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps<T> {
  data: T[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
  loadingMessage?: React.ReactNode;
  threshold?: number;
}

export function InfiniteScroll<T>({
  data,
  fetchNextPage,
  hasNextPage,
  isLoading,
  renderItem,
  endMessage,
  className,
  loadingMessage,
  threshold = 0.5
}: InfiniteScrollProps<T>) {
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false
  });
  
  // Debounce fetch to prevent multiple calls
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (inView && hasNextPage && !isLoading && !isFetchingMore) {
      setIsFetchingMore(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        fetchNextPage();
        setIsFetchingMore(false);
      }, 300);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inView, hasNextPage, isLoading, isFetchingMore, fetchNextPage]);

  return (
    <div className={className}>
      {/* Render all items */}
      {data.map((item, index) => renderItem(item, index))}
      
      {/* Loading indicator */}
      {(isLoading || isFetchingMore) && (
        <div className="flex justify-center items-center py-4">
          {loadingMessage || (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading more items...</p>
            </div>
          )}
        </div>
      )}
      
      {/* End message */}
      {!hasNextPage && !isLoading && data.length > 0 && (
        <div className="py-4 text-center text-sm text-muted-foreground">
          {endMessage || "You've reached the end"}
        </div>
      )}
      
      {/* Intersection observer target */}
      {hasNextPage && <div ref={ref} className="h-1" />}
    </div>
  );
}
