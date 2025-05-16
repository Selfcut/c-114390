
// Content item types definition
export type ContentItemType = 'knowledge' | 'quote' | 'media' | 'ai' | 'wiki';

// Content item status
export type ContentItemStatus = 'published' | 'draft' | 'archived' | 'pending';

// Format for content item data
export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentItemType;
  status?: ContentItemStatus;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  author?: string;
  image?: string;
  tags?: string[];
  likes?: number;
  views?: number;
  comments?: number;
  category?: string;
  sources?: string[];
  content?: string;
}

export interface WikiContentItem extends ContentItem {
  category: string;
  contributors: number;
}
