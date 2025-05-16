
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Play } from "lucide-react";

interface VideoCardProps {
  url: string;
  title: string;
}

export const VideoCard = ({ url, title }: VideoCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  if (hasError) {
    return (
      <div className="rounded-md bg-muted h-[300px] flex items-center justify-center">
        <div className="text-center p-4">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            This video cannot be played
          </p>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div
        className="relative rounded-md overflow-hidden bg-muted h-[300px] cursor-pointer"
        onClick={handlePlayClick}
      >
        {url && url.includes('poster=') ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${url.split('poster=')[1]})` }} />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center text-white">
            <Play size={32} className="ml-1" />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-md overflow-hidden bg-muted h-[300px]">
      {isLoading && <Skeleton className="absolute inset-0" />}
      <video
        src={url}
        controls
        className="w-full h-full"
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        autoPlay
      />
    </div>
  );
};
