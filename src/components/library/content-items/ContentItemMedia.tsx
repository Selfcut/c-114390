
import React from 'react';
import { MediaType } from './ContentItemTypes';

interface ContentItemMediaProps {
  mediaUrl?: string;
  coverImage?: string;
  mediaType?: MediaType;
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
      // Ensure proper YouTube embed URL format
      const embedUrl = url?.includes('embed') 
        ? url 
        : url?.replace('watch?v=', 'embed/').split('&')[0];
        
      return (
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    case 'document':
      return (
        <div className="flex items-center justify-center aspect-video bg-muted rounded-md overflow-hidden p-4">
          <div className="text-center">
            <div className="mb-2 bg-primary/10 p-4 rounded-full inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <p className="text-sm font-medium">{title}</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary mt-2 hover:underline inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              View Document
            </a>
          </div>
        </div>
      );
    case 'text':
      return (
        <div className="relative aspect-video bg-muted/30 rounded-md overflow-hidden p-4">
          <div className="prose prose-sm dark:prose-invert w-full max-h-full overflow-auto">
            {url ? (
              <div dangerouslySetInnerHTML={{ __html: url }} />
            ) : (
              <p className="text-muted-foreground italic">Text content unavailable</p>
            )}
          </div>
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
