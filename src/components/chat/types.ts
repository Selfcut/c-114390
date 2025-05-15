
export interface ChatMessage {
  id: string;
  sender: {
    id?: string;
    name: string;
    avatar: string;
    isSystem?: boolean;
  };
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  isGlobal?: boolean;
  isGroup?: boolean;
  members?: Array<{id: string; name: string; avatar: string;}>;
}
