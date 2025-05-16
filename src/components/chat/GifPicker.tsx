
import React, { useState, useEffect } from 'react';
import { Gift, Search, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GifPickerProps {
  onGifSelect: (gif: { url: string; alt: string }) => void;
}

// Mock GIF categories for demo purposes
const gifCategories = [
  { 
    id: "trending",
    name: "Trending",
    gifs: [
      { id: "1", url: "https://media.tenor.com/xB-hoU_E5xcAAAAC/good-morning-sunshine.gif", alt: "Good morning" },
      { id: "2", url: "https://media.tenor.com/6ItGp9UIvzwAAAAd/cute-cat-cute.gif", alt: "Cute cat" },
      { id: "3", url: "https://media.tenor.com/11XjzFMCnPMAAAAM/kevin-hart-mind-blown.gif", alt: "Mind blown" },
      { id: "4", url: "https://media.tenor.com/ivN41U9L3MoAAAAC/nod-nodding.gif", alt: "Nodding" }
    ]
  },
  { 
    id: "reactions",
    name: "Reactions",
    gifs: [
      { id: "5", url: "https://media.tenor.com/8sVJzgOiDaIAAAAM/hmm-thinking.gif", alt: "Thinking" },
      { id: "6", url: "https://media.tenor.com/3Vn_9t3-29gAAAAM/shocked-speechless.gif", alt: "Shocked" },
      { id: "7", url: "https://media.tenor.com/DHJkAedtyM4AAAAC/clapping-clapping-hands.gif", alt: "Clapping" },
      { id: "8", url: "https://media.tenor.com/0Vvs4O0WhRYAAAAM/thumbs-up-approve.gif", alt: "Thumbs up" }
    ]
  },
  { 
    id: "animals",
    name: "Animals",
    gifs: [
      { id: "9", url: "https://media.tenor.com/5zCM3cj-lPcAAAAM/cute-cat-paw-kitty-paw.gif", alt: "Cat paw" },
      { id: "10", url: "https://media.tenor.com/xrDvINQ5XbsAAAAM/dog-happy.gif", alt: "Happy dog" },
      { id: "11", url: "https://media.tenor.com/m3Vt6zNF0k0AAAAd/fox-yawning.gif", alt: "Yawning fox" },
      { id: "12", url: "https://media.tenor.com/MjOpIvHiR_sAAAAM/sloth-slow.gif", alt: "Slow sloth" }
    ]
  }
];

export const GifPicker: React.FC<GifPickerProps> = ({ onGifSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: string, url: string, alt: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Simulated search function - in a real app, this would call a GIF API
  const searchGifs = (query: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (query.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      // Combine all GIFs and filter by query
      const allGifs = gifCategories.flatMap(category => category.gifs);
      const filtered = allGifs.filter(gif => 
        gif.alt.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchGifs(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const handleGifSelect = (gif: { id: string, url: string, alt: string }) => {
    onGifSelect({ url: gif.url, alt: gif.alt });
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-muted">
          <Gift size={18} />
          <span className="sr-only">Pick GIF</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-72 p-0" sideOffset={10}>
        <div className="p-2 border-b">
          <div className="relative">
            <Input
              placeholder="Search GIFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 text-xs pr-7"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            </div>
          </div>
        </div>
        
        {searchQuery.trim() !== "" ? (
          <div className="p-2 h-[300px]">
            <ScrollArea className="h-full">
              {isSearching ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {searchResults.map(gif => (
                    <button
                      key={gif.id}
                      className="h-[100px] bg-muted rounded overflow-hidden hover:opacity-80 transition-opacity"
                      onClick={() => handleGifSelect(gif)}
                    >
                      <img 
                        src={gif.url} 
                        alt={gif.alt} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/400x300?text=Failed+to+load";
                        }}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground text-sm">
                  No GIFs found
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid grid-cols-3 p-1">
              {gifCategories.map(category => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="px-2 py-1 h-7 text-xs data-[state=active]:bg-muted"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {gifCategories.map(category => (
              <TabsContent key={category.id} value={category.id} className="h-[300px] p-0">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {category.gifs.map(gif => (
                      <button
                        key={gif.id}
                        className="h-[100px] bg-muted rounded overflow-hidden hover:opacity-80 transition-opacity"
                        onClick={() => handleGifSelect(gif)}
                      >
                        <img 
                          src={gif.url} 
                          alt={gif.alt} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/400x300?text=Failed+to+load";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </PopoverContent>
    </Popover>
  );
};
