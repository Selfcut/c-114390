
export interface LikesHookResult {
  isLiked: boolean;
  likesCount: number;
  toggleLike: (contentId: string) => Promise<void>;
  checkUserLike: (contentId: string) => Promise<boolean>;
  fetchLikesCount: (contentId: string) => Promise<void>;
  isLoading: boolean;
}
