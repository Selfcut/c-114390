
import { useLikeOperations } from './likes/useLikeOperations';
import { ContentTypeOptions } from './useContentTables';
import { LikesHookResult } from './likes/types';

export const useContentLikes = (options: ContentTypeOptions): LikesHookResult => {
  return useLikeOperations(options);
};
