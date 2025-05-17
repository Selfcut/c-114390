
export interface WikiArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  tags?: string[];
  image_url?: string;
  user_id: string;
  author_name?: string;
  created_at: Date;
  last_updated: Date;
  contributors: number;
  views: number;
}
