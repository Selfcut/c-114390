
import { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layouts/PageLayout";
import { 
  Users, 
  BarChart3, 
  Settings, 
  AlertCircle, 
  MessageSquare, 
  BookOpen, 
  Shield, 
  Database, 
  Layout, 
  Flag,
  ChevronRight
} from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminContentManagement } from "@/components/admin/AdminContentManagement";
import { AdminReports } from "@/components/admin/AdminReports";
import { AdminSettings } from "@/components/admin/AdminSettings";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  
  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    setCurrentPath(path);
  };
  
  // Check if a nav item is active
  const isActive = (path: string) => {
    return currentPath.includes(path);
  };
  
  const adminNavItems = [
    { path: "/admin", icon: <BarChart3 size={18} />, label: "Dashboard" },
    { path: "/admin/users", icon: <Users size={18} />, label: "User Management" },
    { path: "/admin/content", icon: <BookOpen size={18} />, label: "Content Management" },
    { path: "/admin/reports", icon: <Flag size={18} />, label: "Reports & Moderation" },
    { path: "/admin/settings", icon: <Settings size={18} />, label: "Admin Settings" },
  ];
  
  return (
    <PageLayout showSidebar={false}>
      <div className="flex h-full">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-background border-r border-border h-full flex-shrink-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-primary" />
              <h2 className="text-lg font-bold">Admin Panel</h2>
            </div>
          </div>
          
          <nav className="p-2">
            <ul className="space-y-1">
              {adminNavItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive(item.path) ? "" : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => handleNavigate(item.path)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </li>
              ))}
            </ul>
            
            <div className="pt-4 mt-4 border-t border-border">
              <ul className="space-y-1">
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
                    asChild
                  >
                    <Link to="/dashboard">
                      <ChevronRight size={18} />
                      <span className="ml-2">Back to App</span>
                    </Link>
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </aside>
        
        {/* Content Area */}
        <div className="flex-1 h-full overflow-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUserManagement />} />
            <Route path="/content" element={<AdminContentManagement />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPanel;
