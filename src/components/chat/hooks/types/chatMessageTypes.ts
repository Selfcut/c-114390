
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
