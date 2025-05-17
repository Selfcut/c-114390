
export interface ChatMessage {
  id: string;
  content: string;
  senderName: string;
  userId: string;
  createdAt: string;
  conversationId: string;
  isCurrentUser?: boolean;
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
  sender?: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
    status?: string;
  };
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

export interface ConversationItem {
  id: string;
  name: string;
  lastMessage?: string;
  updated_at?: string;
  created_at?: string;
  is_group?: boolean;
  is_global?: boolean;
}

export interface ChatInterfaceProps {
  initialConversations?: ConversationItem[];
  chatType?: "direct" | "global" | "group";
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  recipientStatus?: string;
  groupId?: string;
  groupName?: string;
  groupAvatar?: string;
  groupMembers?: Array<{
    id: string;
    name: string;
    avatar?: string;
    status?: string;
  }>;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}
