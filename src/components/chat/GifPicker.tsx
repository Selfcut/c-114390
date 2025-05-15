
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, FileImage } from "lucide-react";

// Mock GIFs for demonstration purposes
// In a real application, you would fetch these from the Tenor API
const mockGifs = [
  { id: '1', url: 'https://media.tenor.com/YGm1ZvZ-T8QAAAAC/waving-hello.gif', alt: 'Waving hello' },
  { id: '2', url: 'https://media.tenor.com/9SYoex7TMd8AAAAC/hello-cute.gif', alt: 'Hello cute' },
  { id: '3', url: 'https://media.tenor.com/B5qmLu7dpXcAAAAd/good-morning-hello.gif', alt: 'Good morning hello' },
  { id: '4', url: 'https://media.tenor.com/S_PadIIOchAAAAAC/yoda-hello.gif', alt: 'Yoda hello' },
  { id: '5', url: 'https://media.tenor.com/HNUmdm5Qs0EAAAAC/hello-cat.gif', alt: 'Hello cat' },
  { id: '6', url: 'https://media.tenor.com/iMdvUZ4fYGUAAAAC/bear-hello.gif', alt: 'Bear hello' },
];

interface GifPickerProps {
  onGifSelect: (gif: { url: string; alt: string }) => void;
}

export const GifPicker = ({ onGifSelect }: GifPickerProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gifs, setGifs] = useState(mockGifs);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock search delay - in a real app, this would be an API call to Tenor
    setTimeout(() => {
      // Filter gifs based on search query (mock implementation)
      const filteredGifs = mockGifs.filter(gif => 
        gif.alt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setGifs(filteredGifs);
      setIsLoading(false);
    }, 500);
  };

  const handleGifClick = (gif: { url: string; alt: string }) => {
    onGifSelect(gif);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground"
        >
          <FileImage size={18} />
          <span className="sr-only">GIF picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <form onSubmit={handleSearch} className="mb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search GIFs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        <div className="h-60 overflow-y-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : gifs.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  className="overflow-hidden rounded-md hover:opacity-80 transition-opacity"
                  onClick={() => handleGifClick(gif)}
                >
                  <img 
                    src={gif.url} 
                    alt={gif.alt} 
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No GIFs found</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
