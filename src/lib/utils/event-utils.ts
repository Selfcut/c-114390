
type EventCallback<T = any> = (data: T) => void;

const eventListeners: Record<string, EventCallback[]> = {};

// Function to publish a chat sidebar toggle event
export const publishChatSidebarToggle = (isOpen: boolean | ((prev: boolean) => boolean)) => {
  const eventName = 'chat-sidebar-toggle';
  const listeners = eventListeners[eventName] || [];
  listeners.forEach(callback => callback(isOpen));
};

// Function to subscribe to a chat sidebar toggle event
export const subscribeToChatSidebarToggle = (callback: EventCallback<boolean | ((prev: boolean) => boolean)>) => {
  const eventName = 'chat-sidebar-toggle';
  
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  
  eventListeners[eventName].push(callback);
  
  // Return unsubscribe function
  return () => {
    eventListeners[eventName] = eventListeners[eventName].filter(cb => cb !== callback);
  };
};

// Function to publish any custom event
export const publishEvent = <T>(eventName: string, data: T) => {
  const listeners = eventListeners[eventName] || [];
  listeners.forEach(callback => callback(data));
};

// Function to subscribe to any custom event
export const subscribeToEvent = <T>(eventName: string, callback: EventCallback<T>) => {
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  
  eventListeners[eventName].push(callback as EventCallback);
  
  // Return unsubscribe function
  return () => {
    eventListeners[eventName] = eventListeners[eventName].filter(cb => cb !== callback);
  };
};

// Add CSS for pushing main content when sidebar opens
export const addChatSidebarStyles = () => {
  // Add a style element if it doesn't exist
  const styleId = 'chat-sidebar-styles';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = `
      body.chat-sidebar-open main {
        margin-right: var(--chat-sidebar-width);
        transition: margin-right 0.3s ease;
      }
      
      main {
        transition: margin-right 0.3s ease;
      }
    `;
    document.head.appendChild(styleElement);
  }
};

// Call this function to ensure the styles are added
addChatSidebarStyles();
