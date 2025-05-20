
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
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  username?: string;
  messageId: string;
  users: string[];
  count: number;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: string;
  isGlobal?: boolean;
  isGroup?: boolean;
}

export interface ConversationItem extends Conversation {
  avatar?: string;
  unreadCount?: number;
  lastActivityAt?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'away' | 'do-not-disturb';
}
