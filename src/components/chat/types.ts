
export interface ChatMessage {
  id: string;
  content: string;
  senderName?: string;
  userId: string;
  createdAt: string;
  isCurrentUser: boolean;
  conversationId: string;
  replyTo?: string | ReplyTo;
  effectType?: string;
  isAdmin?: boolean;
  avatarUrl?: string;
  isSystem?: boolean;
  reactions?: MessageReaction[];
  sender?: {
    avatarUrl?: string;
  };
}

export interface ReplyTo {
  id: string;
  content: string;
  senderName: string;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  username: string;
  messageId: string;
  users: string[];
  count: number;
}

export interface ChatUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  isAdmin?: boolean;
}

export interface ChatConversation {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'public';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface ConversationItem {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt?: string;
  lastActivityAt?: string;
  isGlobal?: boolean;
  isGroup?: boolean;
  createdAt?: string;
  avatar?: string;
  unreadCount?: number;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: string;
  isGlobal?: boolean;
  isGroup?: boolean;
  createdAt?: string;
}
