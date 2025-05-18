
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GifPickerProps {
  onGifSelect: (gif: { url: string; alt: string }) => void;
}

// Sample GIFs for demo purposes - in a real app you would use a GIF API
const SAMPLE_GIFS = [
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGJuYWgwejZhdmZ6enFrdDI5ZzFzN2ZhNzZzdzVvdnAwYzA2bWFlZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26FxsQwgJyU4me9ig/giphy.gif",
    alt: "Thumbs up"
  },
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHlwaXg0cDh0bjY1YXZ3dXBkdHN5Mm9tb3ZpNDY0aWJ4djEyeXo2bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYJnJQ4EiYLR9de/giphy.gif",
    alt: "Hello"
  },
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hmYnZxeWVkdzZuaTV3eHJ2Z3M0eWZlYXdyZXhvaHl3emJpMG91dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKoWXm3okO1kgHC/giphy.gif",
    alt: "Thanks"
  },
  {
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWlna3J3MXc3YnpsNXNpbWYyZTgwM295eTQwN3JnMDhodHE1dWVrOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DRsN032KfVl19CCnqK/giphy.gif",
    alt: "LOL"
  }
];

export const GifPicker = ({ onGifSelect }: GifPickerProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const filteredGifs = searchTerm
    ? SAMPLE_GIFS.filter(gif => gif.alt.toLowerCase().includes(searchTerm.toLowerCase()))
    : SAMPLE_GIFS;

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
        <div className="space-y-3">
          <Input 
            placeholder="Search GIFs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {filteredGifs.map((gif, index) => (
              <button
                key={index}
                className="w-full h-24 overflow-hidden rounded border border-border hover:border-primary/50 transition-colors"
                onClick={() => onGifSelect(gif)}
              >
                <img 
                  src={gif.url} 
                  alt={gif.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          {filteredGifs.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No GIFs found matching your search
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
