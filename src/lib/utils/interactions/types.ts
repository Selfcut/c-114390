
export interface ContentInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export type InteractionType = 'like' | 'bookmark';
