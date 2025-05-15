
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Book, MessageSquare, User, FileText, Calendar, Lightbulb } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  CommandDialog, 
  CommandGroup, 
  CommandItem, 
  CommandList, 
  CommandInput,
  CommandEmpty
} from "@/components/ui/command";
import { useNavigate } from 'react-router-dom';

type SearchResult = {
  id: string;
  type: 'discussion' | 'book' | 'user' | 'article' | 'event' | 'concept';
  title: string;
  description?: string;
  url: string;
};

const mockSearchResults: SearchResult[] = [
  { id: '1', type: 'discussion', title: 'The Nature of Consciousness', description: 'Philosophical debate on consciousness', url: '/forum/discussion/1' },
  { id: '2', type: 'book', title: 'Gödel, Escher, Bach', description: 'By Douglas Hofstadter', url: '/library/books/2' },
  { id: '3', type: 'user', title: 'Alan Turing', description: 'Computer scientist and mathematician', url: '/profile/alan-turing' },
  { id: '4', type: 'article', title: 'The Unreasonable Effectiveness of Mathematics', description: 'Academic paper on mathematics in natural sciences', url: '/library/articles/4' },
  { id: '5', type: 'event', title: 'Quantum Computing Seminar', description: 'Online event on May 28, 2025', url: '/events/5' },
  { id: '6', type: 'concept', title: 'Emergent Properties', description: 'Complex systems theory concept', url: '/wiki/concepts/6' },
];

export function EnhancedSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      // In a real app, this would be an API call
      const filtered = mockSearchResults.filter(
        item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultClick = (url: string) => {
    navigate(url);
    setOpen(false);
  };
  
  const getIconForType = (type: string) => {
    switch (type) {
      case 'book': return <Book className="h-4 w-4" />;
      case 'discussion': return <MessageSquare className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'concept': return <Lightbulb className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for anything..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem 
                  key={result.id} 
                  onSelect={() => handleResultClick(result.url)}
                  className="flex items-center"
                >
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-md border">
                    {getIconForType(result.type)}
                  </div>
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.description && (
                      <span className="text-xs text-muted-foreground">{result.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
