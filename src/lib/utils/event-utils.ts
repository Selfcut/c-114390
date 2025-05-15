
/**
 * Dispatch a custom event to notify that the chat sidebar state has changed
 */
export const dispatchChatSidebarToggle = (isOpen: boolean) => {
  // Create and dispatch a custom event
  const event = new CustomEvent('chatSidebarToggle', { 
    detail: { isOpen } 
  });
  
  window.dispatchEvent(event);
};

/**
 * Subscribe to chat sidebar toggle events
 */
export const subscribeToChatSidebarToggle = (callback: (isOpen: boolean) => void) => {
  const handleEvent = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail.isOpen);
  };
  
  window.addEventListener('chatSidebarToggle', handleEvent);
  
  return () => {
    window.removeEventListener('chatSidebarToggle', handleEvent);
  };
};
