
export interface ChatMessage {
  id: string;
  content: string;
  senderName: string;
  userId: string;
  createdAt: string;
  conversationId?: string;
  isEdited?: boolean;
  isCurrentUser?: boolean;
  isSystem?: boolean;
  isAdmin?: boolean;
  effectType?: string;
  mentions?: string[];
  reactions?: Reaction[];
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
  attachments?: {
    id?: string;
    type: 'image' | 'file' | 'gif' | 'audio' | 'video';
    url: string;
    name?: string;
    size?: number;
  }[];
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ConversationItem {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: string;
  isGroup?: boolean;
  isGlobal?: boolean;
  participants?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

export type ChatInputMode = 'normal' | 'editing' | 'replying';
