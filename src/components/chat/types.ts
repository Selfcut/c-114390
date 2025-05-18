
export type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  conversationId: string;
  userId: string;
  senderName: string;
  isCurrentUser?: boolean;
  isAdmin?: boolean;
  isSystem?: boolean;
  isEdited?: boolean;
  effectType?: string;
  mentions?: string[];
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
};

export type ConversationItem = {
  id: string;
  name: string;
  lastMessage?: string;
  avatar?: string;
  updatedAt: string;
  unread?: number;
  isGroup?: boolean;
  isGlobal?: boolean;
};

export type Conversation = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  last_message?: string;
  is_group?: boolean;
  is_global?: boolean;
};
