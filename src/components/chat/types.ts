
export interface ChatMessage {
  id: string;
  content: string;
  conversationId: string;
  userId: string;
  senderName?: string;
  createdAt: string;
  isCurrentUser?: boolean;
  isAdmin?: boolean;
  effectType?: string;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  
  reactions?: Array<{
    emoji: string;
    count: number;
    users?: string[];
  }>;
  isSystem?: boolean;
  isEdited?: boolean;
  mentions?: string[];
}

export interface ConversationItem {
  id: string;
  name: string;
  lastMessage?: string;
  lastActivityAt: string;
  unreadCount?: number;
  participants?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  
  // Adding missing properties that are used in the code
  avatar?: string;
  isGlobal?: boolean;
  isGroup?: boolean;
  unread?: number;
  updatedAt?: string;
}

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  participants: string[];
  createdAt: string;
  updatedAt: string;
  
  // Adding missing properties that are used in the code
  name?: string;
  last_message?: string;
  lastMessage?: string;
  is_global?: boolean;
  isGlobal?: boolean;
  is_group?: boolean;
  isGroup?: boolean;
  updated_at?: string;
}
