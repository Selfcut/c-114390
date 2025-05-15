
// Event system for cross-component communication
type EventCallback<T> = (data: T) => void;

// Event map to manage different event types and their callbacks
const eventMap: Map<string, EventCallback<any>[]> = new Map();

// Generic publish function to emit events
export function publishEvent<T>(eventName: string, data: T): void {
  const callbacks = eventMap.get(eventName) || [];
  callbacks.forEach(callback => callback(data));
}

// Generic subscribe function to listen for events
export function subscribeToEvent<T>(
  eventName: string, 
  callback: EventCallback<T>
): () => void {
  // Get or create array of callbacks for this event
  const callbacks = eventMap.get(eventName) || [];
  callbacks.push(callback);
  eventMap.set(eventName, callbacks);

  // Return unsubscribe function
  return () => {
    const currentCallbacks = eventMap.get(eventName) || [];
    const filteredCallbacks = currentCallbacks.filter(cb => cb !== callback);
    eventMap.set(eventName, filteredCallbacks);
  };
}

// Chat sidebar specific events
export const CHAT_SIDEBAR_TOGGLE = 'chat-sidebar-toggle';

export function publishChatSidebarToggle(isOpen: boolean): void {
  publishEvent(CHAT_SIDEBAR_TOGGLE, isOpen);
}

export function subscribeToChatSidebarToggle(
  callback: (isOpen: boolean) => void
): () => void {
  return subscribeToEvent(CHAT_SIDEBAR_TOGGLE, callback);
}

// Event system for global modals
export const GLOBAL_MODAL_OPEN = 'global-modal-open';

export function publishGlobalModalOpen(
  modalId: string,
  modalProps: Record<string, any> = {}
): void {
  publishEvent(GLOBAL_MODAL_OPEN, { modalId, modalProps });
}

export function subscribeToGlobalModalOpen(
  callback: (data: { modalId: string; modalProps: Record<string, any> }) => void
): () => void {
  return subscribeToEvent(GLOBAL_MODAL_OPEN, callback);
}
