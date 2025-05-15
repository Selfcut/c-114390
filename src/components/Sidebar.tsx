
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  Home,
  BookOpen,
  MessageSquare,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Layers,
  Shield
} from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/library", icon: <BookOpen size={20} />, label: "Library" },
    { path: "/forum", icon: <MessageSquare size={20} />, label: "Forum" },
    { path: "/chat", icon: <Users size={20} />, label: "Chat" },
    { path: "/analytics", icon: <BarChart2 size={20} />, label: "Analytics" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];
  
  // Show admin link only for admin users
  const isAdmin = user?.role === 'admin';

  return (
    <div className="sidebar w-64 bg-background border-r border-border h-screen flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Polymath Logo" className="h-8 w-8" />
          <span className="font-bold text-xl">Polymath</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 overflow-auto">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={item.path} className={`animate-fade-in delay-${index * 100}`}>
              <NavLink to={item.path} className="block">
                <Button 
                  variant={isActive(item.path) ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              </NavLink>
            </li>
          ))}
          
          {isAdmin && (
            <li className="animate-fade-in" style={{ animationDelay: `${navItems.length * 100}ms` }}>
              <NavLink to="/admin" className="block">
                <Button 
                  variant={isActive("/admin") ? "default" : "ghost"} 
                  className="w-full justify-start"
                >
                  <Shield size={20} />
                  <span className="ml-2">Admin Panel</span>
                  <span className="ml-auto bg-primary/20 text-primary text-xs px-1.5 rounded-full">
                    New
                  </span>
                </Button>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <div className="text-sm">
            <p className="font-medium">Level {user?.level || 1}</p>
            <div className="h-1.5 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: "45%" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">550 XP to next level</p>
          </div>
        </div>
      </div>
    </div>
  );
};
