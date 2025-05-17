
import React from 'react';

interface YoutubeEmbedProps {
  url: string;
}

export const YoutubeEmbed = ({ url }: YoutubeEmbedProps) => {
  // Handle YouTube embed safely
  const renderYoutubeEmbed = () => {
    try {
      if (!url) return null;
      
      return (
        <iframe
          src={url}
          title="YouTube video player"
          className="w-full aspect-video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } catch (e) {
      console.error("Error rendering YouTube embed:", e);
      return (
        <div className="bg-muted w-full aspect-video flex items-center justify-center">
          <p className="text-muted-foreground">Unable to load YouTube video</p>
        </div>
      );
    }
  };

  return (
    <div className="w-full aspect-video bg-black">
      {renderYoutubeEmbed()}
    </div>
  );
};
