
import React from 'react';

interface YouTubeCardProps {
  url: string;
  title: string;
}

export const YouTubeCard = ({ url, title }: YouTubeCardProps) => {
  const embedId = getYouTubeEmbedId(url);
  
  function getYouTubeEmbedId(url: string): string {
    try {
      // Regular YouTube URL pattern
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      
      if (match && match[2].length === 11) {
        return match[2];
      }
      
      // If no match, return empty string
      return '';
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
      return '';
    }
  }

  if (!embedId) {
    return (
      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-md overflow-hidden bg-black">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      ></iframe>
    </div>
  );
};
