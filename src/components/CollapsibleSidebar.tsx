
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Library, MessageSquare, User, Settings, 
  Youtube, Book, FileText, Shield, Menu, X, AlertTriangle,
  Quote, Calendar, PenLine, StickyNote
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLayout } from "@/contexts/LayoutContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const CollapsibleSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useLayout();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Toggle sidebar with Alt+S
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [toggleSidebar]);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/forum", icon: MessageSquare, label: "Forum" },
    { path: "/library", icon: Library, label: "Library" },
    { path: "/wiki", icon: Book, label: "Wiki" },
    { path: "/media", icon: Youtube, label: "Media" },
    { path: "/quotes", icon: Quote, label: "Quotes" },
    { path: "/words", icon: PenLine, label: "Words" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/problems", icon: AlertTriangle, label: "Problems" },
  ];

  // Admin route
  if (user?.isAdmin || user?.role === "admin") {
    navItems.push({ path: "/admin", icon: Shield, label: "Admin" });
  }

  // User routes
  navItems.push(
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/settings", icon: Settings, label: "Settings" }
  );

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out md:translate-x-0",
        "bg-sidebar border-r border-sidebar-border",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
      aria-label="Main navigation"
      role="navigation"
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <h2 className="font-semibold text-lg text-sidebar-foreground">Polymath</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="ml-auto hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title="Toggle sidebar (Alt+S)"
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="py-4 overflow-y-auto h-[calc(100vh-4rem)]">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            const navItem = (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sidebar-foreground",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );

            return sidebarCollapsed ? (
              <TooltipProvider key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {navItem}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              navItem
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
