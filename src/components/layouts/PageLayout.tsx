
import React from 'react';
import Header from '@/components/Header';
import { FullHeightChatSidebar } from '@/components/chat/FullHeightChatSidebar';

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
    <div className="page-layout">
      {!hideHeader && <Header />}
      <div className="min-h-[calc(100vh-4rem)]">
        {children}
      </div>
      <FullHeightChatSidebar />
    </div>
  );
};
