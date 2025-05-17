
export interface MessageReply {
  id: string;
  content: string;
  senderName: string;
}

export type AdminEffect = 'rainbow' | 'highlight' | 'announcement' | 'system-alert' | 'pinned';
