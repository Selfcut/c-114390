
import React from 'react';
import Header from '@/components/Header';
import { FullHeightChatSidebar } from '@/components/chat/FullHeightChatSidebar';
import { CollapsibleSidebar } from '@/components/CollapsibleSidebar';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  
  // Don't render the header for specific routes that handle their own headers
  const pathsWithOwnHeaders: string[] = []; 
  const shouldShowHeader = !hideHeader && !pathsWithOwnHeaders.includes(location.pathname);

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <CollapsibleSidebar />
      
      {/* Main content */}
      <div className="flex-1 relative ml-[var(--sidebar-width)] transition-all duration-300" style={{ 
        marginRight: 'var(--content-margin-right, 0)',
        width: 'calc(100% - var(--sidebar-width) - var(--content-margin-right, 0))'
      }}>
        {shouldShowHeader && <Header />}
        <div className="min-h-[calc(100vh-4rem)] p-4">
          {children}
        </div>
      </div>
      
      {/* Chat sidebar */}
      <FullHeightChatSidebar />
    </div>
  );
};
