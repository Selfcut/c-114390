
export interface ChatMessage {
  id: string;
  content: string;
  senderName?: string;
  userId: string;
  createdAt: string;
  isCurrentUser: boolean;
  conversationId: string;
  replyTo?: string;
  effectType?: string;
  isAdmin?: boolean;
  avatarUrl?: string;
  sender?: {
    avatarUrl?: string;
  };
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
