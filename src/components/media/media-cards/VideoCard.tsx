
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  url: string;
  title: string;
  className?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({ url, title, className }) => {
  return (
    <Card className={cn("overflow-hidden my-4", className)}>
      <div className="aspect-video">
        {url ? (
          <video 
            src={url} 
            controls
            className="w-full h-full object-cover"
            onError={(e) => {
              // Set a custom error message if video fails to load
              const video = e.target as HTMLVideoElement;
              video.style.display = 'none';
              const parent = video.parentElement;
              if (parent) {
                const error = document.createElement('div');
                error.className = "w-full h-full bg-muted flex items-center justify-center";
                error.innerHTML = "<p class='text-muted-foreground'>Video not available</p>";
                parent.appendChild(error);
              }
            }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Video not available</p>
          </div>
        )}
      </div>
    </Card>
  );
};
