
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Library, MessageSquare, User, Settings, 
  Youtube, Book, FileText, Shield, Cog, Menu, X 
} from "lucide-react";
import { useAuth } from "@/lib/auth"; // Updated import path
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      newState ? '64px' : '256px'
    );
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/forum", icon: MessageSquare, label: "Forum" },
    { path: "/library", icon: Library, label: "Library" },
    { path: "/wiki", icon: Book, label: "Wiki" },
    { path: "/media", icon: Youtube, label: "Media" },
    { path: "/quotes", icon: FileText, label: "Quotes" },
    { path: "/ai", icon: Cog, label: "AI Tools" },
  ];

  // Admin route
  if (user?.isAdmin) {
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
        "bg-background border-r h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <h2 className="font-semibold text-lg">Polymath</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent/50 text-foreground"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};
