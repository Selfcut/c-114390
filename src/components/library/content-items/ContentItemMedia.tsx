
import React from 'react';

interface ContentItemMediaProps {
  mediaUrl?: string;
  coverImage?: string;
  mediaType?: 'image' | 'video' | 'document' | 'youtube' | 'text';
  title: string;
}

export const ContentItemMedia: React.FC<ContentItemMediaProps> = ({
  mediaUrl,
  coverImage,
  mediaType,
  title
}) => {
  if (!mediaUrl && !coverImage) return null;
  
  const url = mediaUrl || coverImage;
  
  switch(mediaType) {
    case 'image':
      return (
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          <img 
            src={url} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    case 'video':
      return (
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          <video 
            src={url} 
            controls 
            className="w-full h-full object-cover"
          />
        </div>
      );
    case 'youtube':
      return (
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          <iframe
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    default:
      if (url) {
        return (
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
            <img 
              src={url} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        );
      }
      return null;
  }
};
