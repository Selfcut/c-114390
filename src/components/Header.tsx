
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, LogOut, Settings, User, X, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/lib/theme-context";
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
} from "@/components/ui/command";
import { searchContentWithSupabase } from "@/lib/search-utils";
import { useToast } from "@/hooks/use-toast";

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Listen for command+k to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(async () => {
      if (value.length > 1) {
        // Fetch search results
        try {
          const { success, data, error } = await searchContentWithSupabase(value);
          if (success && data) {
            setSearchResults(data);
          } else if (error) {
            console.error("Search error:", error);
            setSearchResults([]);
          }
        } catch (err) {
          console.error("Search error:", err);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
  };

  // Handle search result selection
  const handleSelectSearchResult = (item: any) => {
    setIsCommandOpen(false);
    navigate(item.url);
    toast({
      title: "Item selected",
      description: `You selected "${item.title}"`,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const renderSearchResultIcon = (type: string) => {
    switch (type) {
      case 'discussion': return <Search className="mr-2 h-4 w-4" />;
      case 'book': return <Search className="mr-2 h-4 w-4" />;
      case 'profile': return <User className="mr-2 h-4 w-4" />;
      case 'article': return <Search className="mr-2 h-4 w-4" />;
      case 'event': return <Search className="mr-2 h-4 w-4" />;
      default: return <Search className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Polymath Logo" className="h-8 w-8" />
            <span className="font-bold text-foreground">Polymath</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Global Search */}
          <Button 
            variant="outline" 
            className="relative h-9 w-9 sm:w-64 sm:justify-start sm:px-3 sm:py-2"
            onClick={() => setIsCommandOpen(true)}
          >
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline-flex">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          
          <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
            <CommandInput 
              placeholder="Search everything..." 
              value={searchQuery}
              onValueChange={handleSearchChange}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {searchResults.length > 0 && (
                <CommandGroup heading="Search Results">
                  {searchResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelectSearchResult(result)}
                      className="flex items-center"
                    >
                      {renderSearchResultIcon(result.type)}
                      <div className="flex flex-col">
                        <span>{result.title}</span>
                        {result.excerpt && (
                          <span className="text-xs text-muted-foreground">{result.excerpt}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {searchQuery.length > 0 && searchResults.length === 0 && (
                <CommandGroup>
                  <CommandItem disabled>Searching...</CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </CommandDialog>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <Badge 
                  className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center p-0"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs">
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto py-2">
                <DropdownMenuItem className="p-3 cursor-pointer hover:bg-muted focus:bg-muted">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">John Doe</span>{" "}
                        replied to your discussion{" "}
                        <span className="font-medium">"Quantum Mechanics and Reality"</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer hover:bg-muted focus:bg-muted">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Sarah Adams</span>{" "}
                        mentioned you in a comment
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer hover:bg-muted focus:bg-muted">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Bell size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm">
                        Your content submission was approved!
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className="border-t p-2 text-center">
                <Button variant="ghost" size="sm" className="w-full text-sm" onClick={() => navigate('/notifications')}>
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="@user" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User size={16} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Premium Button */}
          <Button size="sm" className="bg-[#6E59A5] hover:bg-[#7E69B5]">Premium</Button>

          {/* Help Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/help/ask')} className="cursor-pointer">
                Ask a Question
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/help/knowledge-base')} className="cursor-pointer">
                Knowledge Base
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/help/guides')} className="cursor-pointer">
                Learning Guides
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/wiki')} className="cursor-pointer">
                Wiki Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
