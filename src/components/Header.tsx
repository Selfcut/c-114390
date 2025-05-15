
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '../../public/logo.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/lib/theme-context";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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
} from "@/components/ui/sheet";

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Polymath Logo" className="h-8 w-8" />
            <span className="font-bold text-foreground">Polymath</span>
          </Link>
          
          <div className="hidden md:flex items-center ml-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        isActive("/") ? "text-primary" : ""
                      }`}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/forum">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        isActive("/forum") ? "text-primary" : ""
                      }`}
                    >
                      Discussion Forum
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/library">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        isActive("/library") ? "text-primary" : ""
                      }`}
                    >
                      Knowledge Library
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/quotes">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        isActive("/quotes") ? "text-primary" : ""
                      }`}
                    >
                      Quotes
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/wiki">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        isActive("/wiki") ? "text-primary" : ""
                      }`}
                    >
                      Wiki
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/chat">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} ${
                        isActive("/chat") ? "text-primary" : ""
                      }`}
                    >
                      Chat
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative rounded-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full md:w-[240px] rounded-md border-0 bg-muted py-1.5 pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary"
              placeholder="Search Polymath..."
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              1
            </span>
          </Button>
          
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
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="hidden sm:flex items-center gap-2">
            <Button size="sm">Join Premium</Button>
            <Button variant="outline" size="sm">Contribute</Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Link to="/" className={`${isActive("/") ? "text-primary" : ""} font-medium`}>
                  Home
                </Link>
                <Link to="/forum" className={`${isActive("/forum") ? "text-primary" : ""} font-medium`}>
                  Discussion Forum
                </Link>
                <Link to="/library" className={`${isActive("/library") ? "text-primary" : ""} font-medium`}>
                  Knowledge Library  
                </Link>
                <Link to="/quotes" className={`${isActive("/quotes") ? "text-primary" : ""} font-medium`}>
                  Quotes
                </Link>
                <Link to="/wiki" className={`${isActive("/wiki") ? "text-primary" : ""} font-medium`}>
                  Wiki
                </Link>
                <Link to="/chat" className={`${isActive("/chat") ? "text-primary" : ""} font-medium`}>
                  Chat
                </Link>
                <div className="border-t border-border my-4"></div>
                <Button className="w-full">Join Premium</Button>
                <Button variant="outline" className="w-full mt-2">Contribute</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Mobile Navigation - Only shown on small screens */}
      <div className="md:hidden border-t border-border">
        <nav className="flex justify-between px-4 py-2">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center text-xs ${
              isActive("/") ? "text-primary" : "text-foreground"
            }`}
          >
            <span>Home</span>
          </Link>
          <Link 
            to="/forum" 
            className={`flex flex-col items-center justify-center text-xs ${
              isActive("/forum") ? "text-primary" : "text-foreground"
            }`}
          >
            <span>Forum</span>
          </Link>
          <Link 
            to="/library" 
            className={`flex flex-col items-center justify-center text-xs ${
              isActive("/library") ? "text-primary" : "text-foreground"
            }`}
          >
            <span>Library</span>
          </Link>
          <Link 
            to="/quotes" 
            className={`flex flex-col items-center justify-center text-xs ${
              isActive("/quotes") ? "text-primary" : "text-foreground"
            }`}
          >
            <span>Quotes</span>
          </Link>
          <Link 
            to="/wiki" 
            className={`flex flex-col items-center justify-center text-xs ${
              isActive("/wiki") ? "text-primary" : "text-foreground"
            }`}
          >
            <span>Wiki</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
