
import { useState, useEffect } from 'react';

// Simple event system for cross-component communication
const eventTarget = new EventTarget();
const TOGGLE_EVENT = 'chatSidebarToggle';

// Publish toggle event
export const publishChatSidebarToggle = (state: boolean | ((prev: boolean) => boolean)) => {
  const event = new CustomEvent(TOGGLE_EVENT, { detail: state });
  eventTarget.dispatchEvent(event);
};

// Subscribe to toggle events
export const subscribeToChatSidebarToggle = (callback: (state: boolean | ((prev: boolean) => boolean)) => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail);
  };
  
  eventTarget.addEventListener(TOGGLE_EVENT, handler);
  return () => eventTarget.removeEventListener(TOGGLE_EVENT, handler);
};

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
        
        // Add a class to the body element for more CSS control
        if (newState) {
          document.body.classList.add('chat-sidebar-open');
        } else {
          document.body.classList.remove('chat-sidebar-open');
        }
      } else if (typeof newState === 'function') {
        setIsOpen(prev => {
          const nextState = newState(prev);
          localStorage.setItem('chatSidebarOpen', String(nextState));
          
          // Update CSS variable and body class for the main content area
          if (nextState) {
            document.documentElement.style.setProperty('--content-margin-right', 'var(--chat-sidebar-width)');
            document.body.classList.add('chat-sidebar-open');
          } else {
            document.documentElement.style.setProperty('--content-margin-right', '0');
            document.body.classList.remove('chat-sidebar-open');
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
        document.body.classList.remove('chat-sidebar-open');
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial CSS variable and body class setup
    if (isOpen) {
      document.documentElement.style.setProperty('--content-margin-right', 'var(--chat-sidebar-width)');
      document.body.classList.add('chat-sidebar-open');
    } else {
      document.documentElement.style.setProperty('--content-margin-right', '0');
      document.body.classList.remove('chat-sidebar-open');
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
      document.body.classList.add('chat-sidebar-open');
    } else {
      document.documentElement.style.setProperty('--content-margin-right', '0');
      document.body.classList.remove('chat-sidebar-open');
    }
  };

  return {
    isOpen,
    toggleSidebar
  };
};
