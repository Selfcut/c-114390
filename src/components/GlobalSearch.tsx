
import React, { useState, useEffect, useRef } from 'react';
import { Search, User, MessageSquare, BookOpen, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { searchContentWithSupabase } from '@/lib/search-utils';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

type SearchResult = {
  id: string;
  type: 'discussion' | 'book' | 'profile' | 'article' | 'event';
  title: string;
  excerpt?: string;
  author?: string;
  url: string;
  avatar?: string;
  date?: string;
};

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const { success, data, error } = await searchContentWithSupabase(debouncedQuery);
        if (success && data) {
          setResults(data);
        } else {
          console.error('Search error:', error);
          setResults([]);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Close search when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, results, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && searchResultsRef.current) {
      const selectedElement = searchResultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('');
    setIsOpen(false);
    navigate(result.url);
  };

  const handleSearchFocus = () => {
    setIsOpen(searchQuery.length > 0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsOpen(query.length > 0);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'discussion':
        return <MessageSquare size={18} />;
      case 'profile':
        return <User size={18} />;
      case 'book':
      case 'article':
        return <BookOpen size={18} />;
      case 'event':
        return <Calendar size={18} />;
      default:
        return <Search size={18} />;
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search everything..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          className="pl-10 pr-10 py-2 w-full bg-background"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={searchResultsRef}
            className="absolute z-50 top-full left-0 right-0 mt-1 py-2 bg-popover border border-border rounded-md shadow-lg max-h-[70vh] overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {isSearching ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              results.map((result, index) => (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`flex items-start px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors ${
                    index === selectedIndex ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  <div className="mr-3 mt-1 flex-shrink-0">
                    {result.type === 'profile' && result.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={result.avatar} alt={result.title} />
                        <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getIconForType(result.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="font-medium truncate">{result.title}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </span>
                    </div>
                    {result.excerpt && (
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {result.excerpt}
                      </p>
                    )}
                    {(result.author || result.date) && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {result.author && <span className="mr-2">by {result.author}</span>}
                        {result.date && <span>{result.date}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : searchQuery ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Search size={24} className="mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try different keywords or check the spelling
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
