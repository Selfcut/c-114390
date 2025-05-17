
import { ChatMessage } from './types';

export const consciousnessStemMessages: ChatMessage[] = [
  {
    id: 'auto-1',
    content: "Did you know that recent research in quantum biology suggests that quantum effects may play a role in consciousness? The quantum coherence in microtubules within neurons could be key to understanding how the brain generates consciousness.",
    senderName: "Neural Network",
    userId: "system-auto",
    createdAt: new Date().toISOString(),
    isSystem: true
  },
  {
    id: 'auto-2',
    content: "The hard problem of consciousness asks: Why does physical processing in the brain give rise to subjective experience? Despite advances in neuroscience, this philosophical question remains largely unanswered.",
    senderName: "Philosophy Bot",
    userId: "system-auto",
    createdAt: new Date().toISOString(),
    isSystem: true
  },
  {
    id: 'auto-3',
    content: "Researchers at MIT have developed neural networks that can detect consciousnesses-like properties in artificial systems. This brings us closer to understanding what consciousness actually is and how it might be replicated.",
    senderName: "Tech Update",
    userId: "system-auto",
    createdAt: new Date().toISOString(),
    isSystem: true
  },
  {
    id: 'auto-4',
    content: "The emergence theory of consciousness suggests that consciousness emerges from complex information processing systems when they reach a certain threshold of complexity. This could explain why certain neural networks exhibit consciousness-like properties.",
    senderName: "Science Daily",
    userId: "system-auto",
    createdAt: new Date().toISOString(),
    isSystem: true
  },
  {
    id: 'auto-5',
    content: "According to integrated information theory (IIT), consciousness corresponds to a certain type of information integration within a system. The theory assigns a numerical value (Φ) to measure the level of consciousness in any system.",
    senderName: "Neural Network",
    userId: "system-auto",
    createdAt: new Date().toISOString(),
    isSystem: true
  },
  {
    id: 'auto-6',
    content: "![neural-activity](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3c0Z3c2MGU4MGp4OHo3ZWdyeXZpN3ZycnE5eTBmeGQ0Y3Z2cGVxeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt481isNVuQI1l6/giphy.gif)\nThis visualization shows neural activity during conscious thought processes. The complex patterns of activation represent the integrated information that may give rise to conscious experience.",
    senderName: "Brain Viz",
    userId: "system-auto",
    createdAt: new Date().toISOString(),
    isSystem: true
  },
  {
    id: 'auto-7',
    content: "A fascinating aspect of STEM education is how it encourages the development of critical thinking and problem-solving skills that mirror the information processing capabilities of the conscious brain.",
    senderName: "Education Hub",
    userId: "system-auto",
    createdAt: new Date().toISOString(),
    isSystem: true
  },
  {
    id: 'auto-8',
    content: "The development of brain-computer interfaces (BCIs) is opening new frontiers in understanding consciousness. By directly interfacing with neural activity, we may soon have new insights into the nature of conscious experience.",
    senderName: "Tech Update",
    userId: "system-auto",
    createdAt: new Date().toISOString(),
    isSystem: true
  }
];

// Function to get a random automated message
export const getRandomAutomatedMessage = (): ChatMessage => {
  const randomIndex = Math.floor(Math.random() * consciousnessStemMessages.length);
  const message = consciousnessStemMessages[randomIndex];
  
  return {
    ...message,
    id: `auto-${Date.now()}`, // Generate a new ID to ensure uniqueness
    createdAt: new Date().toISOString() // Update timestamp to current time
  };
};

// Function to schedule automated messages
export const scheduleAutomatedMessages = (
  addMessage: (message: ChatMessage) => void,
  minDelay = 300000, // 5 minutes minimum
  maxDelay = 1200000 // 20 minutes maximum
): () => void => {
  const getRandomDelay = () => Math.floor(Math.random() * (maxDelay - minDelay) + minDelay);
  
  let timeoutId: number | null = null;
  
  const scheduleNext = () => {
    const delay = getRandomDelay();
    timeoutId = window.setTimeout(() => {
      const newMessage = getRandomAutomatedMessage();
      addMessage(newMessage);
      scheduleNext(); // Schedule the next message
    }, delay);
  };
  
  // Start the scheduling
  scheduleNext();
  
  // Return cleanup function
  return () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  };
};
