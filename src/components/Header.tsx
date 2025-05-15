import React, { useState } from 'react';
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
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    setIsSearchExpanded(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = (form.elements.namedItem('search') as HTMLInputElement).value;
    toast({
      title: "Search Results",
      description: `Found 8 results for "${query}"`,
    });
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
          <form 
            className={cn(
              "relative rounded-md transition-all duration-300",
              isSearchExpanded ? "w-64" : "w-40"
            )}
            onSubmit={handleSearchSubmit}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <Input
              type="search"
              name="search"
              className="block w-full rounded-md border-0 bg-muted py-1.5 pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary"
              placeholder="Search..."
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
          </form>
          
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
          
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
          
          <Button size="sm" className="bg-[#6E59A5] hover:bg-[#7E69B5]">Premium</Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/ask-question')} className="cursor-pointer">
                Ask a Question
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/knowledge-base')} className="cursor-pointer">
                Knowledge Base
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/learning-guides')} className="cursor-pointer">
                Learning Guides
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/wiki-access')} className="cursor-pointer">
                Wiki Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="flex justify-between items-center">
                <SheetTitle>Menu</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X size={18} />
                  </Button>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/" 
                  className={`${(isActive("/") || isActive("/dashboard")) ? "text-primary" : ""} font-medium flex items-center gap-2 p-2 rounded-md hover:bg-muted`}
                >
                  Home
                </Link>
                <Link 
                  to="/forum" 
                  className={`${isActive("/forum") ? "text-primary" : ""} font-medium flex items-center gap-2 p-2 rounded-md hover:bg-muted`}
                >
                  Forum
                </Link>
                <Link 
                  to="/library" 
                  className={`${isActive("/library") ? "text-primary" : ""} font-medium flex items-center gap-2 p-2 rounded-md hover:bg-muted`}
                >
                  Library  
                </Link>
                <Link 
                  to="/quotes" 
                  className={`${isActive("/quotes") ? "text-primary" : ""} font-medium flex items-center gap-2 p-2 rounded-md hover:bg-muted`}
                >
                  Quotes
                </Link>
                <Link 
                  to="/wiki" 
                  className={`${isActive("/wiki") ? "text-primary" : ""} font-medium flex items-center gap-2 p-2 rounded-md hover:bg-muted`}
                >
                  Wiki
                </Link>
                <Link 
                  to="/chat" 
                  className={`${isActive("/chat") ? "text-primary" : ""} font-medium flex items-center gap-2 p-2 rounded-md hover:bg-muted`}
                >
                  Chat
                </Link>
                <div className="border-t border-border my-4"></div>
                <Button className="w-full bg-[#6E59A5] hover:bg-[#7E69B5]">Premium</Button>
                <Button variant="outline" className="w-full mt-2">Contribute</Button>
                <Button variant="destructive" className="w-full mt-2" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
