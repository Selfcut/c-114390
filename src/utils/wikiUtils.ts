
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
    // Create a basic query that doesn't join with profiles
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

    // Now get user profiles in a separate query
    const userIds = articles?.map(article => article.user_id) || [];
    
    // Get profiles if we have user IDs
    let profiles: Record<string, { name?: string; avatar_url?: string }> = {};
    
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);
        
      if (profilesData) {
        profilesData.forEach(profile => {
          profiles[profile.id] = {
            name: profile.name,
            avatar_url: profile.avatar_url
          };
        });
      }
    }

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
      author: profiles[item.user_id]?.name || 'Unknown'
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

    // Get the author profile
    let authorName = 'Unknown';
    
    if (data.user_id) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', data.user_id)
        .single();
        
      if (profileData && profileData.name) {
        authorName = profileData.name;
      }
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
      author: authorName
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
      views: 0,
      author: 'You' // Assuming it's the current user
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
