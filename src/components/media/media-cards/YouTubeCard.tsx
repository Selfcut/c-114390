
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface YouTubeCardProps {
  url: string;
  title: string;
  className?: string;
}

export const YouTubeCard: React.FC<YouTubeCardProps> = ({ url, title, className }) => {
  // Function to ensure we're using the embed URL format
  const getEmbedUrl = (inputUrl: string): string => {
    // If already an embed URL, return it
    if (inputUrl.includes('youtube.com/embed/')) {
      return inputUrl;
    }
    
    // Extract video ID from various YouTube URL formats
    let videoId: string | null = null;
    
    // Try to match standard YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    
    // Return the embed URL if we found an ID, otherwise the original URL
    return videoId ? `https://www.youtube.com/embed/${videoId}` : inputUrl;
  };

  return (
    <Card className={cn("overflow-hidden my-4", className)}>
      <div className="aspect-video">
        {url ? (
          <iframe
            src={getEmbedUrl(url)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
            onError={() => {
              console.error("Failed to load YouTube video");
            }}
          ></iframe>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">YouTube video not available</p>
          </div>
        )}
      </div>
    </Card>
  );
};
