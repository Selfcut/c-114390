
// Event utility functions for the application

/**
 * Publishes a chat sidebar toggle event to toggle the sidebar visibility
 * @param isOpen Optional boolean to explicitly set the sidebar state
 */
export const publishChatSidebarToggle = (isOpen?: boolean) => {
  const event = new CustomEvent('chatSidebarToggle', {
    detail: isOpen !== undefined ? { isOpen } : {}
  });
  window.dispatchEvent(event);
};

/**
 * Subscribe to chat sidebar toggle events
 * @param callback Function to call when the event is triggered
 * @returns Cleanup function to remove the event listener
 */
export const subscribeToChatSidebarToggle = (callback: (isOpen: boolean) => void) => {
  const handler = (event: CustomEvent) => {
    if (event.detail && typeof event.detail.isOpen === 'boolean') {
      callback(event.detail.isOpen);
    } else {
      // If no explicit state is provided, treat it as a toggle request
      callback(prev => !prev);
    }
  };

  window.addEventListener('chatSidebarToggle', handler as EventListener);
  return () => {
    window.removeEventListener('chatSidebarToggle', handler as EventListener);
  };
};
