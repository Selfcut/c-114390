
export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  conversationId: string;
  createdAt: string;
  senderName?: string;
  isCurrentUser?: boolean;
  avatarUrl?: string;
  sender?: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
  };
  reactions?: MessageReaction[];
  replyToMessage?: ChatMessage;
  isSystem?: boolean;
  isAdmin?: boolean;
  effectType?: string;
  isEdited?: boolean;
  replyTo?: string | { id: string; content: string; senderName: string }; // Support both string ID and object reference
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  username?: string;
  messageId: string;
  users: string[]; // Array of user IDs who reacted with this emoji
  count: number;   // Count of reactions
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt?: string; 
  lastActivityAt?: string;
  isGlobal?: boolean;
  isGroup?: boolean;
  createdAt?: string;
  participants?: string[]; // Add participants property
}

export interface ConversationItem extends Conversation {
  avatar?: string;
  unreadCount?: number;
}

export interface ChatUser {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'away' | 'do-not-disturb';
}
