
import React from 'react';

interface VideoCardProps {
  url: string;
  title: string;
}

export const VideoCard = ({ url, title }: VideoCardProps) => {
  return (
    <div className="aspect-video rounded-md overflow-hidden bg-black">
      <video 
        src={url} 
        controls 
        className="w-full h-full"
        poster="/lovable-uploads/video-placeholder.png"
      >
        <p>Your browser doesn't support HTML5 video.</p>
      </video>
    </div>
  );
};
