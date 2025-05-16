
export interface WikiArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  lastUpdated: string;
  contributors: number;
  views: number;
  author?: string;
}
