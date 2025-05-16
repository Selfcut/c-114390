
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface YouTubeCardProps {
  url: string;
  title: string;
}

export const YouTubeCard = ({ url, title }: YouTubeCardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative rounded-md overflow-hidden bg-muted">
      {isLoading && <Skeleton className="w-full h-[300px]" />}
      <div className="aspect-video">
        <iframe
          src={url}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};
