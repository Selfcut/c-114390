
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Library, MessageSquare, User, 
  BookOpen, FileText, Image, Shield, Menu, X 
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const CollapsibleSidebar = () => {
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

  // Initialize the CSS variable on component mount
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      collapsed ? '64px' : '256px'
    );
  }, [collapsed]);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/forum", icon: MessageSquare, label: "Forum" },
    { path: "/library", icon: Library, label: "Library" },
    { path: "/wiki", icon: BookOpen, label: "Wiki" },
    { path: "/media", icon: Image, label: "Media" },
    { path: "/quotes", icon: FileText, label: "Quotes" }
  ];

  // Admin route
  if (user?.isAdmin) {
    navItems.push({ path: "/admin", icon: Shield, label: "Admin" });
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-background border-r z-30 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b h-16">
        {!collapsed && (
          <h2 className="font-semibold text-lg">Polymath</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn("ml-auto", collapsed && "mx-auto")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="py-4 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 hover:no-underline",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent hover:text-accent-foreground text-foreground/80"
                )}
              >
                <item.icon size={20} className={cn(
                  isActive ? "text-primary" : "text-foreground/70"
                )} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
