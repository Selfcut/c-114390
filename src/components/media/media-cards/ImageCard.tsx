
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageCardProps {
  url: string;
  title: string;
}

export const ImageCard = ({ url, title }: ImageCardProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  
  return (
    <div className="relative rounded-md overflow-hidden bg-muted">
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      {error ? (
        <div className="aspect-video flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Failed to load image</p>
        </div>
      ) : (
        <img 
          src={url} 
          alt={title} 
          className="w-full object-contain max-h-[500px]"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
        />
      )}
    </div>
  );
};
