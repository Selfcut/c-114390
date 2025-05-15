
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import {
  LayoutDashboard,
  MessageSquare,
  MessageCircle,
  BookOpen,
  Settings,
  User,
  Quote,
  Brain,
  ShieldCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const CollapsibleSidebar = () => {
  const { user, signOut } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  
  // Get collapsed state from localStorage or default to false
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true' ? true : false;
  });
  
  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Forum",
      path: "/forum",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Chat",
      path: "/chat",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Library",
      path: "/library",
    },
    {
      icon: <GraduationCap className="h-5 w-5" />,
      label: "Wiki",
      path: "/wiki",
    },
    {
      icon: <Quote className="h-5 w-5" />,
      label: "Quotes",
      path: "/quotes",
    },
    {
      icon: <Brain className="h-5 w-5" />,
      label: "AI Tools",
      path: "/ai",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      path: "/profile",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
  ];

  // Add admin entry if user is admin
  if (isAdmin) {
    navItems.push({
      icon: <ShieldCheck className="h-5 w-5" />,
      label: "Admin",
      path: "/admin",
    });
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className={`sidebar h-screen flex flex-col bg-background border-r border-border fixed left-0 top-0 overflow-hidden z-20 transition-width duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className={`flex items-center p-4 h-16 border-b border-border ${collapsed ? "justify-center" : ""}`}>
        {!collapsed && <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />}
        {!collapsed && <span className="font-bold text-lg">Polymath</span>}
        {collapsed && <img src="/logo.svg" alt="Logo" className="h-8 w-8" />}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <TooltipProvider delayDuration={300}>
            {navItems.map((item) => (
              <li key={item.path}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `
                          flex items-center justify-center px-2 py-2 rounded-md
                          ${isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}
                        `}
                      >
                        <span>{item.icon}</span>
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-4 py-2 rounded-md text-sm
                      ${isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </TooltipProvider>
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          {!collapsed && user && (
            <div className="flex items-center overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden mr-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0) || "U"
                )}
              </div>
              <div className="truncate">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>
            </div>
          )}
          {collapsed && user && (
            <div className="mx-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0) || "U"
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {user.name}
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
        {user && !collapsed && (
          <button
            onClick={signOut}
            className="mt-4 text-sm text-center px-4 py-2 rounded-md bg-muted hover:bg-muted/80 w-full"
          >
            Sign out
          </button>
        )}
        {user && collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={signOut}
                className="mt-4 text-sm text-center p-2 rounded-md bg-muted hover:bg-muted/80 w-full flex justify-center"
              >
                <User className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        )}
      </div>
      
      {/* Toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-muted border border-border shadow-sm"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </div>
  );
};
