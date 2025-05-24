
import React, { createContext, useContext, useEffect, useState } from 'react';

interface LayoutContextType {
  sidebarCollapsed: boolean;
  chatSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleChatSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setChatSidebarOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  
  const [chatSidebarOpen, setChatSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('chatSidebarOpen') === 'true';
  });

  // Update CSS variables when layout state changes
  useEffect(() => {
    const updateCSSVariables = () => {
      const sidebarWidth = sidebarCollapsed ? '64px' : '256px';
      const chatSidebarWidth = '360px';
      const contentMarginRight = chatSidebarOpen ? chatSidebarWidth : '0';

      document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
      document.documentElement.style.setProperty('--chat-sidebar-width', chatSidebarWidth);
      document.documentElement.style.setProperty('--content-margin-right', contentMarginRight);
    };

    updateCSSVariables();
  }, [sidebarCollapsed, chatSidebarOpen]);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newState));
    }
  };

  const toggleChatSidebar = () => {
    const newState = !chatSidebarOpen;
    setChatSidebarOpen(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatSidebarOpen', String(newState));
    }
  };

  const value: LayoutContextType = {
    sidebarCollapsed,
    chatSidebarOpen,
    toggleSidebar,
    toggleChatSidebar,
    setSidebarCollapsed,
    setChatSidebarOpen,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};
