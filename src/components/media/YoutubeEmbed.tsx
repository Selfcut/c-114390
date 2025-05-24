
import React from 'react';

interface YoutubeEmbedProps {
  url: string;
  title: string;
  className?: string;
}

export const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ url, title, className = "" }) => {
  // Convert YouTube watch URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes('embed')) return url;
    
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  };

  return (
    <div className={`relative aspect-video bg-muted rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={getEmbedUrl(url)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
};
