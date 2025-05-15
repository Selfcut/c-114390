
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/auth-context";
import {
  Home,
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  Share2,
  Crown,
  PanelLeft,
  PanelRight,
  Search,
  Activity,
  ChevronsLeft,
  ChevronsRight,
  HardDrive,
  Calendar,
  Star,
  Bookmark,
  ShieldCheck,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
  isActive?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  to,
  icon,
  label,
  badge,
  isActive = false,
  isCollapsed,
  onClick,
}: SidebarItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "h-10 w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
              isCollapsed ? "justify-center" : ""
            )}
            onClick={onClick}
          >
            {icon}
            {!isCollapsed && <span>{label}</span>}
            {!isCollapsed && badge && (
              <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            <div className="flex items-center gap-2">
              <span>{label}</span>
              {badge && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isLinkActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div
      className={cn(
        "sidebar border-r bg-card transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden",
        isCollapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      <div className="p-3 flex items-center justify-between border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Polymath Logo" className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Polymath</h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-3 space-y-1">
          <SidebarItem
            to="/dashboard"
            icon={<Home size={18} />}
            label="Dashboard"
            isActive={isLinkActive("/dashboard") || isLinkActive("/")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/forum"
            icon={<MessageSquare size={18} />}
            label="Forum"
            badge="3"
            isActive={isLinkActive("/forum")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/library"
            icon={<BookOpen size={18} />}
            label="Library"
            isActive={isLinkActive("/library")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/chat"
            icon={<Users size={18} />}
            label="Chat"
            badge="2"
            isActive={isLinkActive("/chat")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/explore"
            icon={<Search size={18} />}
            label="Explore"
            isActive={isLinkActive("/explore")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/activity"
            icon={<Activity size={18} />}
            label="Activity"
            isActive={isLinkActive("/activity")}
            isCollapsed={isCollapsed}
          />
        </div>

        {!isCollapsed && <div className="px-3 py-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Personal
          </div>
        </div>}

        <div className="p-3 space-y-1">
          <SidebarItem
            to="/bookmarks"
            icon={<Bookmark size={18} />}
            label="Bookmarks"
            isActive={isLinkActive("/bookmarks")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/calendar"
            icon={<Calendar size={18} />}
            label="Calendar"
            isActive={isLinkActive("/calendar")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/files"
            icon={<HardDrive size={18} />}
            label="My Files"
            isActive={isLinkActive("/files")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/favorites"
            icon={<Star size={18} />}
            label="Favorites"
            isActive={isLinkActive("/favorites")}
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            to="/shared"
            icon={<Share2 size={18} />}
            label="Shared with Me"
            isActive={isLinkActive("/shared")}
            isCollapsed={isCollapsed}
          />
        </div>

        {user?.isAdmin && (
          <>
            {!isCollapsed && <div className="px-3 py-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </div>
            </div>}
            <div className="p-3 space-y-1">
              <SidebarItem
                to="/admin"
                icon={<ShieldCheck size={18} />}
                label="Admin Panel"
                isActive={isLinkActive("/admin")}
                isCollapsed={isCollapsed}
              />
            </div>
          </>
        )}
      </ScrollArea>
      
      <div className="p-3 mt-auto border-t space-y-3">
        <SidebarItem
          to="/settings"
          icon={<Settings size={18} />}
          label="Settings"
          isActive={isLinkActive("/settings")}
          isCollapsed={isCollapsed}
        />
        {!isCollapsed && (
          <Button variant="outline" className="w-full flex items-center gap-2 bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">
            <Crown size={16} />
            <span className="text-sm">Upgrade to Pro</span>
          </Button>
        )}
      </div>
    </div>
  );
};
