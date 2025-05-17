
// Define shared types for forum components
export interface ForumPostType {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: Date;
  tags: string[];
  upvotes: number;
  views: number;
  comments: number;
  isPinned: boolean;
}

export interface CommentType {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  isAuthor: boolean;
}
