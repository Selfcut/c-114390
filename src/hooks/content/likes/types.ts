
export interface LikesHookResult {
  isLoading: boolean;
  checkUserLike: (contentId: string) => Promise<boolean>;
  toggleLike: (contentId: string) => Promise<boolean | void>;
}
