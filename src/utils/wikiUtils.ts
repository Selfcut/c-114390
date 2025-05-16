
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
  author_name?: string;
  contributors?: number;
  views?: number;
  last_updated?: string;
  created_at?: string;
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
    // Create a basic query
    let query = supabase
      .from('wiki_articles')
      .select('*')
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
    const formattedArticles: WikiArticle[] = (articles || []).map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      category: article.category,
      content: article.content,
      lastUpdated: formatLastUpdated(article.last_updated || ''),
      contributors: article.contributors || 1,
      views: article.views || 0,
      author: article.author_name || 'Unknown'
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
      .select('*')
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
      author: data.author_name || 'Unknown'
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
  author_name?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('wiki_articles')
      .insert({
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        category: articleData.category,
        user_id: articleData.user_id,
        author_name: articleData.author_name || 'Anonymous'
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
      views: 0,
      author: data.author_name || 'You'
    };

    return { article };
  } catch (err) {
    console.error('Error creating wiki article:', err);
    return { article: null, error: err };
  }
};

// Function to update an existing wiki article
export const updateWikiArticle = async (
  id: string,
  updates: {
    title?: string;
    description?: string;
    content?: string;
    category?: string;
  }
) => {
  try {
    // Increment contributors count
    await supabase.rpc('increment_counter_fn', {
      row_id: id,
      column_name: 'contributors',
      table_name: 'wiki_articles'
    });
    
    // Update the article
    const { data, error } = await supabase
      .from('wiki_articles')
      .update({
        ...updates,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return { article: null, error: "Failed to update article" };
    }

    // Format the returned data
    const article: WikiArticle = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      content: data.content,
      lastUpdated: "Just now",
      contributors: data.contributors || 1,
      views: data.views || 0,
      author: data.author_name || 'Unknown'
    };

    return { article };
  } catch (err) {
    console.error('Error updating wiki article:', err);
    return { article: null, error: err };
  }
};

// Function to delete a wiki article
export const deleteWikiArticle = async (id: string) => {
  try {
    const { error } = await supabase
      .from('wiki_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error('Error deleting wiki article:', err);
    return { success: false, error: err };
  }
};

// Function to increment view count for an article
export const incrementWikiViews = async (id: string) => {
  try {
    // Use our RPC function to increment the view count
    await supabase.rpc('increment_counter_fn', {
      row_id: id,
      column_name: 'views',
      table_name: 'wiki_articles'
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
