
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
}
