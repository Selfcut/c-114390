
export enum ContentType {
  Quote = 'quote',
  Forum = 'forum',
  Media = 'media',
  Wiki = 'wiki',
  Knowledge = 'knowledge',
  Research = 'research',
  AI = 'ai'
}

export interface UnifiedContent {
  id: string;
  type: ContentType;
  title: string;
  content?: string;
  summary?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  metrics: {
    likes: number;
    comments: number;
    views: number;
    bookmarks?: number;
  };
  tags?: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
}
