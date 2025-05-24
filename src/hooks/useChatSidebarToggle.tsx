
import { useState, useEffect } from 'react';

export const useChatSidebarToggle = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('chatSidebarOpen');
    return savedState === 'true';
  });
  
  useEffect(() => {
    localStorage.setItem('chatSidebarOpen', String(isOpen));
    
    // Update CSS variable for the main content area
    if (isOpen) {
      document.documentElement.style.setProperty('--content-margin-right', 'var(--chat-sidebar-width)');
    } else {
      document.documentElement.style.setProperty('--content-margin-right', '0');
    }
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return {
    isOpen,
    toggleSidebar
  };
};
