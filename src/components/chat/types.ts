export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  senderName: string;
  userId: string;
  createdAt: string;
  conversationId: string;
  isCurrentUser?: boolean;
  isAdmin?: boolean;
  isSystem?: boolean;
  isEdited?: boolean;
  effectType?: string;
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
  reactions?: Reaction[];
  mentions?: string[];
}

export interface ConversationItem {
  id: string;
  name: string;
  lastMessage?: string;
  isGroup?: boolean;
  isGlobal?: boolean;
  createdAt?: string;
  updatedAt: string; // Make this required to match Conversation interface
  unread?: number;
  avatar?: string;
}

// Keep Conversation interface for backwards compatibility
export interface Conversation extends ConversationItem {
  // All properties are now inherited from ConversationItem
}
