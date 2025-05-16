
export interface ChatMessage {
  id: string;
  content: string;
  senderName: string;
  userId: string;
  createdAt: string;
  conversationId: string;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  isEdited?: boolean;
  replyTo?: {
    id: string;
    content: string;
    sender: { name: string };
  } | null;
  mentions?: string[];
  attachments?: Array<{
    id: string;
    type: "image" | "file" | "audio" | "video" | "gif";
    url: string;
    name: string;
    size?: number;
    dimensions?: { width: number; height: number };
  }>;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  updatedAt?: string;
  isGlobal?: boolean;
  isGroup?: boolean;
  members?: Array<{id: string; name: string; avatar: string;}>;
}
