
import React from 'react';
import { CollapsibleSidebar } from "../CollapsibleSidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <CollapsibleSidebar />
      <div 
        className="flex-1 ml-[var(--sidebar-width,256px)] transition-all duration-300"
        style={{ 
          marginLeft: 'var(--sidebar-width, 256px)'
        }}
      >
        {children}
      </div>
    </div>
  );
};
