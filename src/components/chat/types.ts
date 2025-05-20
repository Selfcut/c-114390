
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
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  username?: string;
  messageId: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: string;
  isGlobal?: boolean;
  isGroup?: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: 'online' | 'offline' | 'away' | 'do-not-disturb';
}
