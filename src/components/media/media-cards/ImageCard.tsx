
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageCardProps {
  url: string;
  title: string;
}

export const ImageCard = ({ url, title }: ImageCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative rounded-md overflow-hidden bg-muted h-[300px]">
      {isLoading && <Skeleton className="absolute inset-0" />}
      
      {!hasError ? (
        <img
          src={url}
          alt={title}
          className="w-full h-full object-contain"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">Failed to load image</p>
        </div>
      )}
    </div>
  );
};
