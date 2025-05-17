
// Common chat message types used across multiple chat hook files

export interface MessageReply {
  id: string;
  content: string;
  senderName: string;
}

export interface AdminEffect {
  type: string;
  content?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface DbChatMessage {
  id: string;
  content: string;
  created_at: string;
  conversation_id: string;
  user_id?: string;
  sender_name?: string;
  is_admin?: boolean;
  effect_type?: string;
  reply_to?: string;
  updated_at?: string;
}
