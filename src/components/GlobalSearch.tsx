
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, Book, MessageSquare, User, LightbulbIcon, File } from "lucide-react";
import { searchContentWithSupabase } from "@/lib/search-utils";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  url: string;
  author?: string;
  date?: string;
};

export const GlobalSearch = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search hotkey handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen(prevOpen => !prevOpen);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const { success, data, error } = await searchContentWithSupabase(searchQuery);
      
      if (success && data) {
        setResults(data);
      } else {
        console.error("Search error:", error);
        setResults([]);
      }
    } catch (error) {
      console.error("Search execution error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle query changes with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    navigate(result.url);
  };

  // Get icon based on content type
  const getIconForType = (type: string) => {
    switch (type) {
      case 'discussion':
        return <MessageSquare className="mr-2 h-4 w-4" />;
      case 'book':
      case 'article':
        return <Book className="mr-2 h-4 w-4" />;
      case 'profile':
        return <User className="mr-2 h-4 w-4" />;
      case 'event':
        return <LightbulbIcon className="mr-2 h-4 w-4" />;
      default:
        return <File className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full h-9 justify-between px-3 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center">
          <Search className="mr-2 h-4 w-4" />
          <span>Search...</span>
        </div>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for anything..." 
          value={query}
          onValueChange={setQuery}
          ref={inputRef}
          autoFocus
        />
        <CommandList>
          {isLoading && (
            <div className="py-6 text-center">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground mt-2">Searching...</p>
            </div>
          )}

          <CommandEmpty>
            {query && !isLoading ? (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">No results found.</p>
              </div>
            ) : null}
          </CommandEmpty>

          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => (
                <CommandItem 
                  key={`${result.type}-${result.id}`} 
                  onSelect={() => handleSelect(result)}
                  className="hover:bg-accent/50"
                >
                  <div className="flex items-center">
                    {getIconForType(result.type)}
                    <div className="flex flex-col">
                      <span className="text-sm">{result.title}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-md">
                        {result.excerpt}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
            
          <CommandSeparator />
          
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => navigate('/library')}>
              <Book className="mr-2 h-4 w-4" />
              <span>Browse Knowledge Library</span>
            </CommandItem>
            <CommandItem onSelect={() => navigate('/forum')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>View Latest Discussions</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
