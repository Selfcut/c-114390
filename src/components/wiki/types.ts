
export interface WikiArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  last_updated: Date;
  contributors: number;
  views: number;
  author_name?: string;
  tags?: string[];
  image_url?: string;
  user_id: string;
  created_at: Date;
  likes?: number;
}
