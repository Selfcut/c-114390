
import { supabase } from "@/integrations/supabase/client";
import { WikiArticle } from "@/components/wiki/types";

// Type for raw Supabase wiki article data
export interface WikiArticleRaw {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  user_id: string;
  contributors?: number;
  views?: number;
  last_updated?: string;
  created_at?: string;
  profiles?: {
    name?: string;
    avatar_url?: string;
  };
}

// Function to get all wiki articles
export const fetchWikiArticles = async (options?: {
  category?: string;
  page?: number;
  pageSize?: number;
}) => {
  const pageSize = options?.pageSize || 9;
  const page = options?.page || 0;

  try {
    // Use raw SQL query to fetch wiki articles
    let query = `
      SELECT 
        wa.*,
        p.name,
        p.avatar_url
      FROM 
        wiki_articles wa
      LEFT JOIN
        profiles p ON wa.user_id = p.id
      ORDER BY 
        wa.last_updated DESC
    `;

    // Add category filter if specified
    const params: any[] = [];
    if (options?.category) {
      query += ` WHERE wa.category = $1`;
      params.push(options.category);
    }

    // Add pagination
    query += ` LIMIT ${pageSize} OFFSET ${page * pageSize}`;

    const { data, error } = await supabase.rpc('execute_sql', { 
      query_text: query,
      params: params
    });

    if (error) throw error;

    // Format the returned data
    const formattedArticles: WikiArticle[] = (data as WikiArticleRaw[]).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      content: item.content,
      lastUpdated: formatLastUpdated(item.last_updated || ''),
      contributors: item.contributors || 1,
      views: item.views || 0,
      author: item.profiles?.name || 'Unknown'
    }));

    return { articles: formattedArticles, hasMore: formattedArticles.length === pageSize };
  } catch (err) {
    console.error('Error fetching wiki articles:', err);
    return { articles: [], hasMore: false, error: err };
  }
};

// Function to get a single wiki article by ID
export const fetchWikiArticleById = async (id: string) => {
  try {
    // Use raw SQL query to fetch wiki article by ID
    const query = `
      SELECT 
        wa.*,
        p.name,
        p.avatar_url
      FROM 
        wiki_articles wa
      LEFT JOIN
        profiles p ON wa.user_id = p.id
      WHERE 
        wa.id = $1
    `;

    const { data, error } = await supabase.rpc('execute_sql', { 
      query_text: query,
      params: [id]
    });

    if (error) throw error;
    
    if (!data || !data[0]) {
      return { article: null, error: "Article not found" };
    }

    const item = data[0] as WikiArticleRaw;

    // Format the returned data
    const article: WikiArticle = {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      content: item.content,
      lastUpdated: formatLastUpdated(item.last_updated || ''),
      contributors: item.contributors || 1,
      views: item.views || 0,
      author: item.profiles?.name || 'Unknown'
    };

    // Update view count
    await incrementWikiViews(id);

    return { article };
  } catch (err) {
    console.error('Error fetching wiki article:', err);
    return { article: null, error: err };
  }
};

// Function to create a new wiki article
export const createWikiArticle = async (articleData: {
  title: string;
  description: string;
  content: string;
  category: string;
  user_id: string;
}) => {
  try {
    const query = `
      INSERT INTO wiki_articles (
        title, 
        description, 
        content, 
        category, 
        user_id
      ) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const { data, error } = await supabase.rpc('execute_sql', { 
      query_text: query,
      params: [
        articleData.title,
        articleData.description,
        articleData.content,
        articleData.category,
        articleData.user_id
      ]
    });

    if (error) throw error;

    if (!data || !data[0]) {
      return { article: null, error: "Failed to create article" };
    }

    const item = data[0] as WikiArticleRaw;

    // Format the returned data
    const article: WikiArticle = {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      content: item.content,
      lastUpdated: "Just now",
      contributors: 1,
      views: 0
    };

    return { article };
  } catch (err) {
    console.error('Error creating wiki article:', err);
    return { article: null, error: err };
  }
};

// Function to increment view count for an article
export const incrementWikiViews = async (id: string) => {
  try {
    const query = `
      UPDATE wiki_articles 
      SET views = COALESCE(views, 0) + 1 
      WHERE id = $1
    `;

    await supabase.rpc('execute_sql', { 
      query_text: query,
      params: [id]
    });
    
    return { success: true };
  } catch (err) {
    console.error('Error incrementing view count:', err);
    return { success: false, error: err };
  }
};

// Format the last updated date
export const formatLastUpdated = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};
