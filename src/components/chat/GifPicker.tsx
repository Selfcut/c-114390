
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface GifPickerProps {
  onGifSelect: (gif: { url: string; alt: string }) => void;
}

// Demo GIF collection - in a production app, this would come from Giphy/Tenor API
const DEMO_GIFS = [
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGNhMDhubGpjcmYyaHQwMWE5NTVmOXVpdjlxajNnYnp5eWw3MnlyayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lqM3SXMEfUj7vSf05I/giphy.gif",
    alt: "thinking"
  },
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGVpaTY2djlyenoxcWpneGo0YXozZDAwcHYzem5ncHZrMG5zOWl4NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bAplZhiLAsNnG/giphy.gif",
    alt: "thumbs up"
  },
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXN2eTFzcDlkaDF0NzNlYTBwdDl4ZTU3M2U0eGZoMXI4azBoMDNueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gJuTwM3m5vF2o/giphy.gif",
    alt: "clapping"
  },
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzFjOGI1M21raGhqdjZid3g5Mnl4ZGZpbmtsN21rajBkbWJjdzE1MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2A75RyXVzzSI2bx4Gj/giphy.gif",
    alt: "wow"
  },
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnhlaHBvMWdxZmVubDRpYWVmN3p2aHR3YTNnNDRkc2dsamxuZ2FwayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SXgvqZ4kYrMHVRPCeZ/giphy.gif",
    alt: "typing"
  },
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWJucGp3a3c2ZDF6eWcwMnlmZmFlaG1vYzFkdm42ZzBtZ3FsYnA2eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jUwpNzg9IcyrK/giphy.gif",
    alt: "confused"
  }
];

export const GifPicker = ({ onGifSelect }: GifPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gifs, setGifs] = useState(DEMO_GIFS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate search - in a real app, this would call a GIF API
    setTimeout(() => {
      if (searchTerm.trim()) {
        const filtered = DEMO_GIFS.filter(gif => 
          gif.alt.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setGifs(filtered.length ? filtered : DEMO_GIFS);
      } else {
        setGifs(DEMO_GIFS);
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 rounded-full"
        >
          <Image size={16} />
          <span className="sr-only">Add GIF</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="end" sideOffset={5}>
        <form onSubmit={handleSearch} className="mb-3 flex gap-2">
          <Input
            placeholder="Search GIFs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="h-8"
          />
          <Button type="submit" size="sm" className="px-2 h-8">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>
        
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {gifs.map((gif, index) => (
            <Button
              key={`${gif.url}-${index}`}
              variant="outline"
              className="p-0 h-auto aspect-video overflow-hidden"
              onClick={() => onGifSelect(gif)}
            >
              <img 
                src={gif.url} 
                alt={gif.alt} 
                className="w-full h-full object-cover"
              />
            </Button>
          ))}
          
          {gifs.length === 0 && !isLoading && (
            <div className="col-span-2 text-center py-4 text-muted-foreground">
              No GIFs found. Try another search.
            </div>
          )}
          
          {isLoading && (
            <div className="col-span-2 flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
