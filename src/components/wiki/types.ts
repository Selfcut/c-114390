
export interface WikiArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  imageUrl?: string;
  author: string;
  authorId: string;
  lastUpdated: string;
  views: number;
  contributors: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface WikiUtilsProps {
  category: string;
  icon: React.ReactNode;
}

export interface ArticleCardProps {
  article: WikiArticle;
  getCategoryIcon: (category: string) => React.ReactNode;
}

export interface FilterOptions {
  category: string | null;
  searchQuery: string;
}
