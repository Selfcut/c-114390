
import { useState, useEffect } from 'react';
import { subscribeToChatSidebarToggle, publishChatSidebarToggle } from "@/lib/utils/event-utils";

export const useChatSidebarToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize sidebar state and listen for toggle events
  useEffect(() => {
    // Initialize from localStorage if available
    const savedState = localStorage.getItem('chatSidebarOpen');
    if (savedState !== null) {
      setIsOpen(savedState === 'true');
    }
    
    // Subscribe to chat sidebar toggle events
    const unsubscribe = subscribeToChatSidebarToggle((newState) => {
      if (typeof newState === 'function') {
        setIsOpen(prev => {
          const nextState = newState(prev);
          localStorage.setItem('chatSidebarOpen', String(nextState));
          return nextState;
        });
      } else {
        setIsOpen(newState);
        localStorage.setItem('chatSidebarOpen', String(newState));
      }
    });
    
    // Handle window resize for mobile
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        setIsOpen(false);
        publishChatSidebarToggle(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
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
    localStorage.setItem('chatSidebarOpen', String(newState));
  };

  return {
    isOpen,
    toggleSidebar
  };
};
