// Event utils for pub/sub pattern

// Sidebar collapse event channel
const SIDEBAR_COLLAPSE_EVENT = "sidebar-collapse";

// Publish sidebar collapse event
export const publishSidebarCollapse = (isCollapsed: boolean): void => {
  const event = new CustomEvent(SIDEBAR_COLLAPSE_EVENT, { detail: isCollapsed });
  document.dispatchEvent(event);
};

// Subscribe to sidebar collapse events
export const subscribeToSidebarCollapse = (callback: (isCollapsed: boolean) => void): () => void => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail);
  };
  
  document.addEventListener(SIDEBAR_COLLAPSE_EVENT, handler);
  return () => document.removeEventListener(SIDEBAR_COLLAPSE_EVENT, handler);
};

// Chat sidebar toggle event channel
const CHAT_SIDEBAR_TOGGLE_EVENT = "chat-sidebar-toggle";

// Publish chat sidebar toggle event
export const publishChatSidebarToggle = (isOpen: boolean | ((prev: boolean) => boolean)): void => {
  // Save to localStorage for persistence
  if (typeof isOpen === 'boolean') {
    localStorage.setItem('chatSidebarOpen', String(isOpen));
  }
  
  // Broadcast event
  const event = new CustomEvent(CHAT_SIDEBAR_TOGGLE_EVENT, { detail: isOpen });
  document.dispatchEvent(event);
};

// Subscribe to chat sidebar toggle events
export const subscribeToChatSidebarToggle = (callback: (isOpen: boolean | ((prev: boolean) => boolean)) => void): () => void => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail);
  };
  
  document.addEventListener(CHAT_SIDEBAR_TOGGLE_EVENT, handler);
  return () => document.removeEventListener(CHAT_SIDEBAR_TOGGLE_EVENT, handler);
};
