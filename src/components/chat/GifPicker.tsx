
import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, FileImage } from "lucide-react";
import { CustomTooltip } from "@/components/ui/CustomTooltip";
import { useToast } from "@/hooks/use-toast";

// API constants - in a real app, this would be in an env file
const TENOR_API_KEY = "LIVDSRZULELA"; // Demo API key for Tenor
const TENOR_API_URL = "https://g.tenor.com/v1";

interface GifResult {
  id: string;
  url: string;
  alt: string;
  preview: string;
}

// Fallback mock GIFs in case the API is not available
const fallbackGifs = [
  { id: '1', url: 'https://media.tenor.com/YGm1ZvZ-T8QAAAAC/waving-hello.gif', alt: 'Waving hello', preview: 'https://media.tenor.com/YGm1ZvZ-T8QAAAAC/waving-hello.gif' },
  { id: '2', url: 'https://media.tenor.com/9SYoex7TMd8AAAAC/hello-cute.gif', alt: 'Hello cute', preview: 'https://media.tenor.com/9SYoex7TMd8AAAAC/hello-cute.gif' },
  { id: '3', url: 'https://media.tenor.com/B5qmLu7dpXcAAAAd/good-morning-hello.gif', alt: 'Good morning hello', preview: 'https://media.tenor.com/B5qmLu7dpXcAAAAd/good-morning-hello.gif' },
  { id: '4', url: 'https://media.tenor.com/S_PadIIOchAAAAAC/yoda-hello.gif', alt: 'Yoda hello', preview: 'https://media.tenor.com/S_PadIIOchAAAAAC/yoda-hello.gif' },
  { id: '5', url: 'https://media.tenor.com/HNUmdm5Qs0EAAAAC/hello-cat.gif', alt: 'Hello cat', preview: 'https://media.tenor.com/HNUmdm5Qs0EAAAAC/hello-cat.gif' },
  { id: '6', url: 'https://media.tenor.com/iMdvUZ4fYGUAAAAC/bear-hello.gif', alt: 'Bear hello', preview: 'https://media.tenor.com/iMdvUZ4fYGUAAAAC/bear-hello.gif' },
];

// Popular GIF categories for quick access
const popularCategories = ["hello", "laugh", "love", "sad", "thanks", "wow"];

interface GifPickerProps {
  onGifSelect: (gif: { url: string; alt: string }) => void;
}

export const GifPicker = ({ onGifSelect }: GifPickerProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>("hello");
  const { toast } = useToast();

  // Fetch GIFs from Tenor API or use fallbacks if API fails
  const fetchGifs = async (query: string = "hello") => {
    setIsLoading(true);
    
    try {
      // Try to fetch from Tenor API
      const response = await fetch(
        `${TENOR_API_URL}/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=12`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch GIFs");
      }
      
      const data = await response.json();
      
      // Map API results to our format
      const results: GifResult[] = data.results.map((item: any) => ({
        id: item.id,
        url: item.media[0].gif.url,
        alt: item.title,
        preview: item.media[0].nanogif.url // Use smaller preview for faster loading
      }));
      
      setGifs(results);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      toast({
        title: "Couldn't load GIFs",
        description: "Using fallback GIF collection",
        variant: "destructive",
      });
      
      // Use fallback GIFs if API fails
      setGifs(fallbackGifs);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial GIFs when component mounts or category changes
  useEffect(() => {
    if (open && activeCategory) {
      fetchGifs(activeCategory);
    }
  }, [open, activeCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setActiveCategory(null);
    fetchGifs(searchQuery);
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery("");
    setActiveCategory(category);
    fetchGifs(category);
  };

  const handleGifClick = (gif: GifResult) => {
    onGifSelect({
      url: gif.url,
      alt: gif.alt
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CustomTooltip content="GIF picker">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground"
          >
            <FileImage size={18} />
            <span className="sr-only">GIF picker</span>
          </Button>
        </CustomTooltip>
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
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-2">
          {popularCategories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryClick(category)}
              className="text-xs h-7"
            >
              {category}
            </Button>
          ))}
        </div>
        
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
                  className="overflow-hidden rounded-md hover:opacity-80 transition-opacity bg-muted/50"
                  onClick={() => handleGifClick(gif)}
                >
                  <img 
                    src={gif.preview || gif.url} 
                    alt={gif.alt} 
                    className="w-full h-24 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback on error
                      e.currentTarget.src = fallbackGifs[0].url;
                    }}
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
