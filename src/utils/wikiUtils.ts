
import { supabase } from "@/integrations/supabase/client";
import { WikiArticle } from "@/components/wiki/types";

interface FetchArticlesOptions {
  category?: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export const fetchWikiArticles = async (options: FetchArticlesOptions = {}) => {
  try {
    const {
      category,
      page = 0,
      pageSize = 9,
      searchQuery = ""
    } = options;
    
    const startIndex = page * pageSize;
    
    let query = supabase
      .from('wiki_articles')
      .select(`
        *,
        profiles:user_id (name, avatar_url)
      `, { count: 'exact' });

    if (category) {
      query = query.eq('category', category);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
      
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + pageSize - 1);
      
    if (error) {
      throw error;
    }

    // Process data to conform to WikiArticle type
    const articles: WikiArticle[] = data ? data.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      category: article.category,
      content: article.content,
      last_updated: new Date(article.last_updated),
      contributors: article.contributors || 1,
      views: article.views || 0,
      tags: article.tags,
      image_url: article.image_url,
      user_id: article.user_id,
      created_at: new Date(article.created_at),
      author_name: article.profiles?.name || 'Anonymous'
    })) : [];

    return { 
      articles, 
      hasMore: count !== null ? startIndex + pageSize < count : false,
      total: count || 0 
    };
  } catch (error) {
    console.error('Error fetching wiki articles:', error);
    return { articles: [], hasMore: false, error };
  }
};

export const fetchWikiArticleById = async (id: string) => {
  try {
    // Update views counter
    await supabase.rpc('increment_counter_fn', {
      row_id: id,
      column_name: 'views',
      table_name: 'wiki_articles'
    });
    
    const { data, error } = await supabase
      .from('wiki_articles')
      .select(`
        *,
        profiles:user_id (name, avatar_url)
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }

    if (!data) {
      return { article: null };
    }

    // Process data to conform to WikiArticle type with safe access to properties
    const article: WikiArticle = {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      content: data.content,
      last_updated: new Date(data.last_updated),
      contributors: data.contributors || 1,
      views: data.views || 0,
      tags: data.tags,
      image_url: data.image_url,
      user_id: data.user_id,
      created_at: new Date(data.created_at),
      author_name: data.profiles?.name || 'Anonymous'
    };

    return { article };
  } catch (error) {
    console.error('Error fetching wiki article by ID:', error);
    return { article: null, error };
  }
};

export const createWikiArticle = async (articleData: Partial<WikiArticle>) => {
  try {
    // Convert Date objects to ISO strings for database storage
    const dataForDb = {
      ...articleData,
      created_at: articleData.created_at instanceof Date ? articleData.created_at.toISOString() : undefined,
      last_updated: articleData.last_updated instanceof Date ? articleData.last_updated.toISOString() : undefined
    };

    const { data, error } = await supabase
      .from('wiki_articles')
      .insert(dataForDb)
      .select();
      
    if (error) {
      throw error;
    }

    return { article: data[0] };
  } catch (error) {
    console.error('Error creating wiki article:', error);
    return { article: null, error };
  }
};

export const updateWikiArticle = async (id: string, updates: Partial<WikiArticle>) => {
  try {
    // Increment contributors if the content was updated
    if (updates.content) {
      await supabase.rpc('increment_counter_fn', {
        row_id: id,
        column_name: 'contributors',
        table_name: 'wiki_articles'
      });
    }
    
    // Convert Date objects to strings for database updates
    const dataForDb = {
      ...updates,
      created_at: updates.created_at instanceof Date ? updates.created_at.toISOString() : undefined,
      last_updated: new Date().toISOString() // Always update last_updated timestamp
    };
    
    const { data, error } = await supabase
      .from('wiki_articles')
      .update(dataForDb)
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }

    return { article: data[0] };
  } catch (error) {
    console.error('Error updating wiki article:', error);
    return { article: null, error };
  }
};

export const deleteWikiArticle = async (id: string) => {
  try {
    const { error } = await supabase
      .from('wiki_articles')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting wiki article:', error);
    return { success: false, error };
  }
};

// Format date helper
export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get category icon
export const getCategoryIcon = (category: string) => {
  const foundCategory = categories.find(c => c.id.toLowerCase() === category.toLowerCase());
  return foundCategory ? foundCategory.icon : BookIcon;
};

// Filter articles by search query and category
export const filterArticles = (
  articles: WikiArticle[],
  searchQuery: string,
  selectedCategory: string | null
) => {
  return articles.filter(article => {
    const matchesSearch = searchQuery
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
        
    const matchesCategory = selectedCategory
      ? article.category === selectedCategory
      : true;
        
    return matchesSearch && matchesCategory;
  });
};

// Placeholder for BookIcon if needed
import { BookOpen as BookIcon } from 'lucide-react';

// Import categories from CategorySidebar for consistency
import { categories } from '@/components/wiki/CategorySidebar';
