
export interface LikesHookResult {
  isLiked: boolean;
  likesCount: number;
  toggleLike: (contentId: string) => void;
  checkUserLike: (contentId: string) => Promise<void>;
  fetchLikesCount: (contentId: string) => Promise<void>;
  isLoading: boolean;
}
