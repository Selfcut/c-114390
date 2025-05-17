
import { useState, useEffect } from 'react';
import { subscribeToChatSidebarToggle, publishChatSidebarToggle } from "@/lib/utils/event-utils";

export const useChatSidebarToggle = () => {
  const [isOpen, setIsOpen] = useState(() => {
    // Initialize from localStorage if available
    const savedState = localStorage.getItem('chatSidebarOpen');
    return savedState === 'true';
  });
  
  // Initialize sidebar state and listen for toggle events
  useEffect(() => {
    // Subscribe to chat sidebar toggle events
    const unsubscribe = subscribeToChatSidebarToggle((newState) => {
      if (typeof newState === 'boolean') {
        setIsOpen(newState);
        localStorage.setItem('chatSidebarOpen', String(newState));
        
        // Update CSS variable for the main content area
        if (newState) {
          document.documentElement.style.setProperty('--content-margin-right', 'var(--chat-sidebar-width)');
        } else {
          document.documentElement.style.setProperty('--content-margin-right', '0');
        }
      } else if (typeof newState === 'function') {
        setIsOpen(prev => {
          const nextState = newState(prev);
          localStorage.setItem('chatSidebarOpen', String(nextState));
          
          // Update CSS variable for the main content area
          if (nextState) {
            document.documentElement.style.setProperty('--content-margin-right', 'var(--chat-sidebar-width)');
          } else {
            document.documentElement.style.setProperty('--content-margin-right', '0');
          }
          
          return nextState;
        });
      }
    });
    
    // Handle window resize for mobile
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
        publishChatSidebarToggle(false);
        document.documentElement.style.setProperty('--content-margin-right', '0');
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial CSS variable setup
    if (isOpen) {
      document.documentElement.style.setProperty('--content-margin-right', 'var(--chat-sidebar-width)');
    } else {
      document.documentElement.style.setProperty('--content-margin-right', '0');
    }
    
    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    publishChatSidebarToggle(newState);
    
    // Update CSS variable for the main content area
    if (newState) {
      document.documentElement.style.setProperty('--content-margin-right', 'var(--chat-sidebar-width)');
    } else {
      document.documentElement.style.setProperty('--content-margin-right', '0');
    }
  };

  return {
    isOpen,
    toggleSidebar
  };
};
