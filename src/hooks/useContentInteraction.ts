
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useContentLikes } from './content/useContentLikes';
import { useContentComments } from './content/useContentComments';
import { InteractionOptions } from './content/types';

export type { InteractionOptions } from './content/types';

export function useContentInteraction(options: InteractionOptions) {
  const { contentType, onSuccess, onError } = options;
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  const { toggleLike, checkUserLike } = useContentLikes({ contentType });
  const { addComment, deleteComment } = useContentComments({ contentType });

  return {
    toggleLike: (contentId: string) => toggleLike(contentId, onSuccess, onError),
    addComment: (contentId: string, comment: string) => addComment(contentId, comment, onSuccess, onError),
    checkUserLike,
    deleteComment: (commentId: string, contentId: string) => deleteComment(commentId, contentId, onSuccess, onError),
    isProcessing,
    isAuthenticated: !!user
  };
}
