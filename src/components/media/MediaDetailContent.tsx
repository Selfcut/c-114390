
import React from "react";
import { MediaPost } from "@/utils/mediaUtils";
import { YoutubeEmbed } from "@/components/media/YoutubeEmbed";
import { ImagePost } from "@/components/media/ImagePost";
import { DocumentPost } from "@/components/media/DocumentPost";
import { TextPost } from "@/components/media/TextPost";

interface MediaDetailContentProps {
  post: MediaPost;
}

export const MediaDetailContent: React.FC<MediaDetailContentProps> = ({ post }) => {
  // Render the appropriate media content
  const renderMediaContent = (post: MediaPost) => {
    switch (post.type) {
      case "youtube":
        return <YoutubeEmbed url={post.url || ""} title={post.title} />;
      case "image":
        return <ImagePost src={post.url || ""} alt={post.title} />;
      case "document":
        return <DocumentPost url={post.url || ""} title={post.title} />;
      case "text":
      default:
        return <TextPost content={post.content || ""} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-w-3xl mx-auto">
        {renderMediaContent(post)}
      </div>
      
      {post.content && (
        <div className="mt-6">
          <p className="whitespace-pre-line">{post.content}</p>
        </div>
      )}
    </div>
  );
};
