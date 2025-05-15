
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
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Sidebar = () => {
  const { user, signOut } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  
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
    <div className="sidebar w-64 h-screen flex flex-col bg-background border-r border-border fixed left-0 top-0 overflow-hidden">
      <div className="flex items-center p-4 h-16 border-b border-border">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="font-bold text-lg">Polymath</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
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
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
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
                <div className="truncate">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                </div>
              </>
            )}
          </div>
          <ThemeToggle />
        </div>
        {user && (
          <button
            onClick={signOut}
            className="mt-4 text-sm text-center px-4 py-2 rounded-md bg-muted hover:bg-muted/80 w-full"
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
};
