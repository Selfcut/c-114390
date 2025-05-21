
import { formatDistanceToNow } from 'date-fns';

export interface DiscussionTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  createdAt: Date;
  tags: string[]; // Making tags required to ensure consistency
  upvotes: number;
  views: number;
  comments: number;
  isPinned: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

export const formatTimeAgo = (date: Date): string => {
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'some time ago';
  }
};
