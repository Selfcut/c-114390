
import React from 'react';
import { CollapsibleSidebar } from '../CollapsibleSidebar';
import { FullHeightChatSidebar } from '../chat/FullHeightChatSidebar';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { LayoutProvider } from '@/contexts/LayoutContext';

interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  hideHeader = false,
  hideFooter = false,
  className = ''
}) => {
  return (
    <LayoutProvider>
      <div className="min-h-screen bg-background flex w-full">
        <CollapsibleSidebar />
        
        <div 
          className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
          style={{ 
            marginLeft: 'var(--sidebar-width, 256px)',
            marginRight: 'var(--content-margin-right, 0)'
          }}
        >
          {!hideHeader && <NavBar />}
          
          <main className={`flex-1 overflow-auto ${className}`}>
            {children}
          </main>
          
          {!hideFooter && <Footer />}
        </div>
        
        <FullHeightChatSidebar />
      </div>
    </LayoutProvider>
  );
};
