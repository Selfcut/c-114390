
import { useOptimizedForumPostDetails } from './useOptimizedForumPostDetails';

// Re-export the optimized version for backward compatibility
export const useForumPostDetails = useOptimizedForumPostDetails;
export { useOptimizedForumPostDetails };
export type { Comment, ForumPost } from './useOptimizedForumPostDetails';
