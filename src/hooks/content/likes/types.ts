
import { ContentTypeOptions } from '../useContentTables';

export interface LikeActionOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export interface ContentLikeResult {
  isLiked: boolean;
  contentId: string;
}

export interface LikesHookResult {
  toggleLike: (contentId: string, onSuccess?: () => void, onError?: (error: any) => void) => Promise<void>;
  checkUserLike: (contentId: string) => Promise<boolean>;
  isProcessing: Record<string, boolean>;
  isAuthenticated: boolean;
}
