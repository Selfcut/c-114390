
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
  LogOut
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth-context";

export const CollapsibleSidebar = () => {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    // Get state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed');
    return savedState === 'true';
  });
  
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  
  // Update localStorage and CSS variables when collapsed state changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
    document.documentElement.style.setProperty(
      '--sidebar-width',
      collapsed ? '64px' : '256px'
    );
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

  return (
    <div className={`sidebar h-screen flex flex-col bg-background border-r border-border fixed left-0 top-0 overflow-hidden z-20 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex items-center p-4 h-16 border-b border-border justify-between">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
          {!collapsed && <span className="font-bold text-lg">Polymath</span>}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <TooltipProvider delayDuration={300}>
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center px-4 py-2 rounded-md text-sm
                        ${isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {!collapsed && item.label}
                    </NavLink>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  {user && (
                    <>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden mr-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0) || "U"
                        )}
                      </div>
                      {!collapsed && (
                        <div className="truncate">
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TooltipTrigger>
              {collapsed && user && (
                <TooltipContent side="right">
                  <p>{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <div className="flex-shrink-0">
            {!collapsed && <ThemeToggle />}
          </div>
        </div>
        {user && (
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className={`mt-4 text-sm ${collapsed ? 'p-2 w-10 h-10' : 'w-full'}`}
          >
            {collapsed ? <LogOut size={16} /> : "Sign out"}
          </Button>
        )}
      </div>
    </div>
  );
};
