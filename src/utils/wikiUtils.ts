
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
    let query = supabase
      .from('wiki_articles')
      .select(`
        *,
        profiles:profiles(name, avatar_url)
      `)
      .order('last_updated', { ascending: false })
      .limit(pageSize)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    // Add category filter if specified
    if (options?.category) {
      query = query.eq('category', options.category);
    }

    const { data: articles, error } = await query;

    if (error) throw error;

    // Format the returned data
    const formattedArticles: WikiArticle[] = (articles || []).map(item => ({
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

    return { 
      articles: formattedArticles, 
      hasMore: formattedArticles.length === pageSize
    };
  } catch (err) {
    console.error('Error fetching wiki articles:', err);
    return { articles: [], hasMore: false, error: err };
  }
};

// Function to get a single wiki article by ID
export const fetchWikiArticleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('wiki_articles')
      .select(`
        *,
        profiles:profiles(name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (!data) {
      return { article: null, error: "Article not found" };
    }

    // Format the returned data
    const article: WikiArticle = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      content: data.content,
      lastUpdated: formatLastUpdated(data.last_updated || ''),
      contributors: data.contributors || 1,
      views: data.views || 0,
      author: data.profiles?.name || 'Unknown'
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
    const { data, error } = await supabase
      .from('wiki_articles')
      .insert({
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        category: articleData.category,
        user_id: articleData.user_id
      })
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return { article: null, error: "Failed to create article" };
    }

    // Format the returned data
    const article: WikiArticle = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      content: data.content,
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
    const { error } = await supabase
      .from('wiki_articles')
      .update({ views: supabase.rpc('increment_counter_fn', { row_id: id, column_name: 'views' }) })
      .eq('id', id);
    
    if (error) throw error;
    
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
