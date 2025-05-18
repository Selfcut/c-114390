
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
