
import React from 'react';

interface ImagePostProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImagePost: React.FC<ImagePostProps> = ({ src, alt, className = "" }) => {
  return (
    <div className={`relative aspect-video bg-muted rounded-lg overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};
