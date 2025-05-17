
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ImagePostProps {
  url: string;
  alt: string;
}

export const ImagePost = ({ url, alt }: ImagePostProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-muted overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Unable to load image</p>
        </div>
      ) : (
        <img
          src={url}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
};
