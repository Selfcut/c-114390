
import { MediaPost } from "@/utils/mediaUtils";

export interface MediaQueryParams {
  mediaType: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  page: number;
}

export interface MediaQueryResult {
  posts: MediaPost[];
  hasMore: boolean;
  error: string | null;
}
