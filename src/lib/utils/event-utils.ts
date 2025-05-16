
// This file handles custom events for communication between components

// Type for the chat sidebar toggle callback function
type ChatSidebarToggleCallback = (isOpen: boolean | ((prev: boolean) => boolean)) => void;
type SidebarCollapseCallback = (isCollapsed: boolean) => void;

// Store for the callbacks
const chatSidebarToggleListeners: ChatSidebarToggleCallback[] = [];
const sidebarCollapseListeners: SidebarCollapseCallback[] = [];

// Subscribe to chat sidebar toggle events
export const subscribeToChatSidebarToggle = (callback: ChatSidebarToggleCallback): (() => void) => {
  chatSidebarToggleListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = chatSidebarToggleListeners.indexOf(callback);
    if (index !== -1) {
      chatSidebarToggleListeners.splice(index, 1);
    }
  };
};

// Publish chat sidebar toggle event
export const publishChatSidebarToggle = (isOpen: boolean | ((prev: boolean) => boolean)) => {
  chatSidebarToggleListeners.forEach(callback => callback(isOpen));
  
  // Only persist the state to localStorage if it's a boolean
  if (typeof isOpen === 'boolean') {
    localStorage.setItem('chatSidebarOpen', String(isOpen));
  }
};

// Subscribe to sidebar collapse events
export const subscribeToSidebarCollapse = (callback: SidebarCollapseCallback): (() => void) => {
  sidebarCollapseListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = sidebarCollapseListeners.indexOf(callback);
    if (index !== -1) {
      sidebarCollapseListeners.splice(index, 1);
    }
  };
};

// Publish sidebar collapse event
export const publishSidebarCollapse = (isCollapsed: boolean) => {
  sidebarCollapseListeners.forEach(callback => callback(isCollapsed));
  // Persist the state to localStorage
  localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  // Update CSS variable
  document.documentElement.style.setProperty(
    '--sidebar-width', 
    isCollapsed ? '64px' : '256px'
  );
};

// Initialize the state from localStorage on page load
export const initializeUIState = () => {
  const chatSidebarOpen = localStorage.getItem('chatSidebarOpen') === 'true';
  const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  
  // Publish initial states
  publishChatSidebarToggle(chatSidebarOpen);
  publishSidebarCollapse(sidebarCollapsed);
};
