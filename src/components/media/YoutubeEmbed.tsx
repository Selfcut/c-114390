
import React from 'react';

interface YoutubeEmbedProps {
  url: string;
}

export const YoutubeEmbed = ({ url }: YoutubeEmbedProps) => {
  // Validate YouTube URL
  const isValidUrl = () => {
    try {
      if (!url) return false;
      
      // Check if it's already an embed URL
      if (url.includes('youtube.com/embed/')) {
        return true;
      }
      
      // Check if it's a regular YouTube URL
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      return youtubeRegex.test(url);
    } catch (e) {
      return false;
    }
  };

  // Handle YouTube embed safely
  const renderYoutubeEmbed = () => {
    try {
      if (!isValidUrl()) {
        return (
          <div className="bg-muted w-full aspect-video flex items-center justify-center">
            <p className="text-muted-foreground">Invalid YouTube URL</p>
          </div>
        );
      }
      
      // Ensure URL is in embed format
      let embedUrl = url;
      if (!url.includes('youtube.com/embed/')) {
        // Extract video ID
        let videoId;
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch?v=')) {
          videoId = new URLSearchParams(url.split('?')[1]).get('v');
        }
        
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else {
          return (
            <div className="bg-muted w-full aspect-video flex items-center justify-center">
              <p className="text-muted-foreground">Could not extract YouTube video ID</p>
            </div>
          );
        }
      }
      
      return (
        <iframe
          src={embedUrl}
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
