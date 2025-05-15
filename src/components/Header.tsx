import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./ModeToggle";
import { UserHoverCard } from "./UserHoverCard";
import {
  Bell,
  HelpCircle,
  Crown,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Search,
  X
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Mock search suggestions
const mockSearchSuggestions = [
  { type: 'user', id: 'user1', text: 'PhilosophyLover', avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=PhilosophyLover' },
  { type: 'topic', id: 'topic1', text: 'Systems Thinking', category: 'Knowledge' },
  { type: 'forum', id: 'forum1', text: 'Consciousness Research', category: 'Discussion' },
  { type: 'quote', id: 'quote1', text: '"The unexamined life is not worth living" - Socrates', category: 'Quote' },
  { type: 'book', id: 'book1', text: 'Gödel, Escher, Bach', author: 'Douglas Hofstadter', category: 'Book' }
];

// Mock notifications
const mockNotifications = [
  {
    id: 'notif1',
    type: 'mention',
    content: 'PhilosophyLover mentioned you in Systems Thinking discussion',
    isRead: false,
    timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 mins ago
  },
  {
    id: 'notif2',
    type: 'reply',
    content: 'WisdomSeeker replied to your comment',
    isRead: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
  },
  {
    id: 'notif3',
    type: 'like',
    content: 'KnowledgeExplorer liked your quote',
    isRead: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: 'notif4',
    type: 'system',
    content: 'Welcome to Polymath! Complete your profile to get started.',
    isRead: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  }
];

const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState(mockNotifications);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Handle search query changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      // In a real app, this would be an API call
      const filtered = mockSearchSuggestions.filter(item => 
        item.text.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    toast({
      title: "Search initiated",
      description: `Searching for "${searchTerm}"`,
    });
    // In a real app, this would navigate to search results
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / (60 * 24))}d ago`;
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="container px-4 h-16 flex items-center justify-between">
        {/* Logo and Search Bar */}
        <div className="flex items-center flex-1 gap-4">
          <Link to="/" className="flex items-center gap-2 mr-4">
            <img src="/logo.svg" alt="Polymath Logo" className="h-8 w-8" />
            <span className="font-bold text-xl hidden md:inline">Polymath</span>
          </Link>
          
          {/* Enhanced Search with autocomplete */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search knowledge, discussions, users..."
                className="pl-10 pr-4 w-full bg-muted/30 border-muted focus-visible:ring-1 focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 overflow-hidden">
                <div className="p-2 max-h-60 overflow-y-auto">
                  {searchResults.map(result => (
                    <div 
                      key={`${result.type}-${result.id}`} 
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => {
                        toast({
                          description: `You selected: ${result.text}`,
                        });
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                    >
                      {result.type === 'user' && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>{result.text[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm">{result.text}</p>
                        <p className="text-xs text-muted-foreground">{result.category || result.author || result.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-center justify-center text-muted-foreground hover:text-foreground"
                    onClick={handleSearchSubmit}
                  >
                    See all results for "{searchTerm}"
                  </Button>
                </div>
              </div>
            )}
          </form>
          
          {/* Mobile search trigger */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Mobile search modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Search</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </form>
            {/* Mobile search results */}
            {searchResults.length > 0 && (
              <div className="mt-4 overflow-y-auto flex-1">
                {searchResults.map(result => (
                  <div 
                    key={`${result.type}-${result.id}`} 
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => {
                      toast({
                        description: `You selected: ${result.text}`,
                      });
                      setSearchTerm('');
                      setIsSearchOpen(false);
                    }}
                  >
                    {result.type === 'user' && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={result.avatar} />
                        <AvatarFallback>{result.text[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p>{result.text}</p>
                      <p className="text-sm text-muted-foreground">{result.category || result.author || result.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ModeToggle />
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-accent hover:text-accent-foreground" aria-label="Notifications">
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-red-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping absolute"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto text-xs px-2 py-1"
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-6 px-2 text-center">
                  <div className="flex justify-center mb-2">
                    <Bell className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 hover:bg-accent/50 cursor-pointer ${!notification.isRead ? 'bg-accent/20' : ''}`}
                      onClick={() => {
                        const updatedNotifications = notifications.map(n => 
                          n.id === notification.id ? { ...n, isRead: true } : n
                        );
                        setNotifications(updatedNotifications);
                        // Handle notification click
                        toast({
                          description: "Navigating to notification content",
                        });
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {notification.type === 'mention' && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                              <span className="text-xs font-medium text-blue-500 dark:text-blue-200">@</span>
                            </span>
                          )}
                          {notification.type === 'reply' && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                              <MessageSquare className="h-3 w-3 text-green-500 dark:text-green-200" />
                            </span>
                          )}
                          {notification.type === 'like' && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                              <span className="text-xs font-medium text-red-500 dark:text-red-200">♥</span>
                            </span>
                          )}
                          {notification.type === 'system' && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                              <span className="text-xs font-medium text-purple-500 dark:text-purple-200">!</span>
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{notification.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatNotificationTime(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Chat */}
          <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground" aria-label="Chat" asChild>
            <Link to="/chat">
              <MessageSquare size={20} />
            </Link>
          </Button>
          
          {/* Premium */}
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1 text-amber-500 border-amber-500/30 hover:bg-amber-500/10">
            <Crown size={14} />
            <span className="text-xs">Premium</span>
          </Button>
          
          {/* Help */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground" aria-label="Help">
                <HelpCircle size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem>Getting Started</DropdownMenuItem>
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report an Issue</DropdownMenuItem>
              <DropdownMenuItem>Contact Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" asChild>
              <Link to="/auth">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
