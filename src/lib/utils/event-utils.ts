
/**
 * Event utils for inter-component communications
 */

type EventCallback<T> = (data: T) => void;
type EventType = 'sidebar-collapse' | 'chat-sidebar-toggle' | 'theme-change';

interface EventHandlers {
  [key: string]: EventCallback<any>[];
}

// Event handlers storage
const handlers: EventHandlers = {};

// Initialize UI state from localStorage
export const initializeUIState = () => {
  // Get sidebar collapsed state from localStorage
  const sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  // Update CSS variable based on sidebar state
  document.documentElement.style.setProperty(
    '--sidebar-width', 
    sidebarCollapsed ? '64px' : '256px'
  );
  
  // Get chat sidebar state from localStorage
  const chatSidebarOpen = localStorage.getItem('chatSidebarOpen') === 'true';
  
  // If we had any other UI state to initialize, we'd do it here
};

// Generic subscribe function
function subscribe<T>(eventType: EventType, callback: EventCallback<T>) {
  if (!handlers[eventType]) {
    handlers[eventType] = [];
  }
  handlers[eventType].push(callback as EventCallback<any>);

  // Return unsubscribe function
  return () => {
    handlers[eventType] = handlers[eventType].filter(handler => handler !== callback);
  };
}

// Generic publish function
function publish<T>(eventType: EventType, data: T) {
  if (!handlers[eventType]) return;
  
  handlers[eventType].forEach(callback => {
    try {
      callback(data);
    } catch (error) {
      console.error(`Error in ${eventType} event handler:`, error);
    }
  });
}

// Sidebar specific events
export const subscribeToSidebarCollapse = (callback: EventCallback<boolean>) => {
  return subscribe<boolean>('sidebar-collapse', callback);
};

export const publishSidebarCollapse = (isCollapsed: boolean) => {
  publish<boolean>('sidebar-collapse', isCollapsed);
};

// Chat sidebar specific events
export const subscribeToChatSidebarToggle = (callback: EventCallback<boolean | ((prev: boolean) => boolean)>) => {
  return subscribe<boolean | ((prev: boolean) => boolean)>('chat-sidebar-toggle', callback);
};

export const publishChatSidebarToggle = (isOpen: boolean | ((prev: boolean) => boolean)) => {
  publish<boolean | ((prev: boolean) => boolean)>('chat-sidebar-toggle', isOpen);
};

// Theme change specific events
export const subscribeToThemeChange = (callback: EventCallback<string>) => {
  return subscribe<string>('theme-change', callback);
};

export const publishThemeChange = (theme: string) => {
  publish<string>('theme-change', theme);
};

// Storage event listener to sync state across tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'sidebar-collapsed') {
    const isCollapsed = event.newValue === 'true';
    publishSidebarCollapse(isCollapsed);
  } else if (event.key === 'chatSidebarOpen') {
    const isOpen = event.newValue === 'true';
    publishChatSidebarToggle(isOpen);
  } else if (event.key === 'theme') {
    const theme = event.newValue || 'system';
    publishThemeChange(theme);
  }
});
