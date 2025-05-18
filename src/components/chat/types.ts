
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
  
  // Add these missing properties to fix the errors
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
}

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  participants: string[];
  createdAt: string;
  updatedAt: string;
}
