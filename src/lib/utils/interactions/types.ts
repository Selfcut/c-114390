
export interface ContentInteractions {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

export interface InteractionResult {
  success: boolean;
  newState: boolean;
}
