
import React from 'react';
import Header from '@/components/Header';
import { FullHeightChatSidebar } from '@/components/chat/FullHeightChatSidebar';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';

interface PageLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  allowGuests?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children,
  hideHeader = false,
  allowGuests = false
}) => {
  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <CollapsibleSidebar />
      
      {/* Main content */}
      <div className="flex-1 relative ml-[var(--sidebar-width)] transition-[margin-right] duration-300" style={{ marginRight: 'var(--content-margin-right, 0)' }}>
        {!hideHeader && <Header />}
        <div className="min-h-[calc(100vh-4rem)] p-4">
          {children}
        </div>
      </div>
      
      {/* Chat sidebar */}
      <FullHeightChatSidebar />
    </div>
  );
};
