
import React from "react";
import Header from "../Header";
import { CollapsibleSidebar } from "../CollapsibleSidebar";
import { FullHeightChatSidebar } from "../chat/FullHeightChatSidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  allowGuests?: boolean;
}

export const PageLayout = ({ children, allowGuests = false }: PageLayoutProps) => {
  // Ensure sidebar width variable is set on mount
  React.useEffect(() => {
    const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      sidebarCollapsed ? '64px' : '256px'
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <CollapsibleSidebar />
        <main className="flex-1 ml-[var(--sidebar-width,256px)] transition-all duration-300">{children}</main>
      </div>
    </div>
  );
};
