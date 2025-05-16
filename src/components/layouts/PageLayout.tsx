
import React, { useState, useEffect } from "react";
import { PromoBar } from "../PromoBar";
import { CollapsibleSidebar } from "../CollapsibleSidebar";
import Header from "../Header";
import { subscribeToChatSidebarToggle } from "@/lib/utils/event-utils";
import { useAuth } from "@/lib/auth-context";
import { trackActivity } from "@/lib/activity-tracker";

interface PageLayoutProps {
  children: React.ReactNode;
  showPromo?: boolean;
  showSidebar?: boolean;
  showHeader?: boolean;
  sectionName?: string;
  allowGuests?: boolean;
}

export const PageLayout = ({ 
  children, 
  showPromo = true, 
  showSidebar = true, 
  showHeader = true,
  sectionName,
  allowGuests = false
}: PageLayoutProps) => {
  // Create a state to track if the chat sidebar is open
  const [isChatOpen, setIsChatOpen] = useState(() => {
    const saved = localStorage.getItem('chatSidebarOpen');
    return saved === 'true' ? true : false;
  });
  
  // Get sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true' ? true : false;
  });
  
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Track section view if section name is provided
  useEffect(() => {
    if (sectionName && user) {
      const trackView = async () => {
        await trackActivity(user.id, 'view', {
          section: sectionName,
          timestamp: new Date().toISOString()
        });
      };
      
      trackView();
    }
  }, [sectionName, user]);

  // Listen to chat sidebar toggle events
  useEffect(() => {
    const unsubscribe = subscribeToChatSidebarToggle((isOpen) => {
      setIsChatOpen(isOpen);
      localStorage.setItem('chatSidebarOpen', String(isOpen));
    });

    // Listen for sidebar collapse changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebar-collapsed') {
        setSidebarCollapsed(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Set CSS variable for sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      sidebarCollapsed ? '64px' : '256px'
    );
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showPromo && <PromoBar />}
      <div className={`flex flex-1 relative transition-all duration-300 ${isChatOpen ? 'mr-[350px]' : ''}`}>
        {showSidebar && (allowGuests || isAuthenticated) && <CollapsibleSidebar />}
        <div className={`flex-1 flex flex-col transition-width duration-300 ${
          showSidebar && (allowGuests || isAuthenticated) ? 'ml-[var(--sidebar-width,64px)]' : ''
        }`}>
          {showHeader && <Header />}
          <main className="flex-1 overflow-auto p-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
