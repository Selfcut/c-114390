
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Library, MessageSquare, User, 
  BookOpen, FileText, Image, Shield, Menu, X, AlertTriangle,
  Microscope, BookText, CalendarDays, Discord
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
    { path: "/quotes", icon: FileText, label: "Quotes" },
    { path: "/research", icon: Microscope, label: "Research" },
    { path: "/book-reviews", icon: BookText, label: "Book Reviews" },
    { path: "/events", icon: CalendarDays, label: "Events" },
    { path: "/problems", icon: AlertTriangle, label: "Problems" }
  ];

  // Admin route
  if (user?.isAdmin) {
    navItems.push({ path: "/admin", icon: Shield, label: "Admin" });
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-background border-r border-border z-30 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border h-16">
        {!collapsed && (
          <div className="flex items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary mr-2"
              aria-label="Polymath Logo"
            >
              <title>Interactive Polymath Icon</title>

              <style>
                {`
                /* Base styles for elements */
                .polymath-icon-group .line {
                  stroke: currentColor;
                  stroke-width: 5;
                  stroke-linecap: round;
                  transition: stroke-width 0.3s ease-out;
                }
                .polymath-icon-group .node {
                  fill: currentColor;
                  transform-origin: center center;
                  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55),
                              fill 0.3s ease-out;
                }
                .polymath-icon-group .center-dot {
                  fill: currentColor;
                  transform-origin: center center;
                  transition: transform 0.3s ease-out, fill 0.3s ease-out;
                }

                /* Hover effects */
                svg:hover .polymath-icon-group .node-1 {
                  transform: scale(1.2);
                }
                svg:hover .polymath-icon-group .node-2 {
                  transform: scale(1.2);
                  transition-delay: 0.05s;
                }
                svg:hover .polymath-icon-group .node-3 {
                  transform: scale(1.2);
                  transition-delay: 0.1s;
                }
                svg:hover .polymath-icon-group .center-dot {
                  transform: scale(1.25);
                }
                svg:hover .polymath-icon-group .line {
                  stroke-width: 6;
                }
                `}
              </style>

              <g className="polymath-icon-group">
                {/* Connecting lines */}
                <g className="lines">
                  <line className="line line-top" x1="50" y1="50" x2="50" y2="25" />
                  <line className="line line-left" x1="50" y1="50" x2="28" y2="65" />
                  <line className="line line-right" x1="50" y1="50" x2="72" y2="65" />
                </g>

                {/* Nodes/Knowledge Areas */}
                <g className="nodes">
                  <circle className="node node-1" cx="50" cy="20" r="10" />
                  <circle className="node node-2" cx="22" cy="70" r="10" />
                  <circle className="node node-3" cx="78" cy="70" r="10" />
                </g>

                {/* Central point */}
                <circle className="center-dot" cx="50" cy="50" r="6" />
              </g>
            </svg>
            <h2 className="font-semibold text-lg">Polymath</h2>
          </div>
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
