
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  url: string;
  title: string;
  className?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ url, title, className }) => {
  return (
    <Card className={cn("overflow-hidden my-4", className)}>
      {url ? (
        <div className="aspect-video relative">
          <img 
            src={url} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Image+Not+Available";
            }} 
          />
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Image not available</p>
        </div>
      )}
    </Card>
  );
};
