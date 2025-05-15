
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
  onClose: () => void;
}

// Mock GIFs for demo purposes
const mockGifs = [
  "https://media.tenor.com/images/b88845161e958bc16a67770a38765119/tenor.gif",
  "https://media.tenor.com/images/ac9b076c16cdf27853803a823389ff41/tenor.gif",
  "https://media.tenor.com/images/2c8964a279327e9c43bc2171e10c6a88/tenor.gif",
  "https://media.tenor.com/images/1066356420fe2b326f3b592f002988ca/tenor.gif",
  "https://media.tenor.com/images/d7e5e826fa952e8fac4dd93d27142cc3/tenor.gif",
  "https://media.tenor.com/images/05a0b63a4205f7c926a48b1ebbe41ca6/tenor.gif",
  "https://media.tenor.com/images/c4c49c809ef4dcec04f1fee5da9cdcf8/tenor.gif",
  "https://media.tenor.com/images/875997324f87ddb9df50b7609c57f7de/tenor.gif",
  "https://media.tenor.com/images/8d1b80af308b4e778dc4c917d028c135/tenor.gif",
  "https://media.tenor.com/images/2d70bc05aef85a90149c14203911e27d/tenor.gif",
  "https://media.tenor.com/images/248360fb4697b04d30c6c43269fee062/tenor.gif",
  "https://media.tenor.com/images/3f1198cfcd977db7c38997bd88f3c503/tenor.gif"
];

// Mock trending categories
const trendingCategories = [
  "Reactions", "Greetings", "Thank You", "Laughing", "Mindblown", "Love", "Cute", "Sad", "Angry"
];

export const GifPicker = ({ onGifSelect, onClose }: GifPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Close the GIF picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Simulate GIF search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Filter GIFs based on search (mock implementation)
  const filteredGifs = mockGifs;

  return (
    <Card className="w-80" ref={containerRef}>
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="font-medium text-sm">GIF</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <X size={14} />
        </Button>
      </div>
      
      <div className="p-2 border-b">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search GIFs"
              className="pl-8 h-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      
      {!searchQuery && (
        <div className="p-2 border-b">
          <h4 className="text-xs font-medium mb-2">Trending Categories</h4>
          <div className="flex flex-wrap gap-1">
            {trendingCategories.map(category => (
              <Button 
                key={category} 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs"
                onClick={() => setSearchQuery(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <ScrollArea className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 p-2">
            {filteredGifs.map((gif, index) => (
              <button
                key={index}
                className="rounded overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                onClick={() => onGifSelect(gif)}
              >
                <img src={gif} alt={`GIF ${index + 1}`} className="w-full h-auto" />
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-2 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Powered by Tenor
        </p>
      </div>
    </Card>
  );
};
