
export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  genre?: string;
  published_year?: number;
  cover_image_url?: string;
  created_at?: string;
  updated_at?: string;
}
