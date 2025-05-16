
import { supabase } from "@/integrations/supabase/client";
import { WikiArticle } from "@/components/wiki/types";
import { format } from "date-fns";

// Fetch wiki articles with pagination and filtering
export const fetchWikiArticles = async ({
  category,
  page = 0,
  pageSize = 10
}: {
  category?: string;
  page?: number;
  pageSize?: number;
}) => {
  try {
    // Start with the base query
    let query = supabase
      .from('wiki_articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    // Add pagination
    query = query.range(page * pageSize, (page + 1) * pageSize - 1);
    
    // Execute query
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Format the dates and map to WikiArticle type
    const formattedArticles = data.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description || "",
      content: article.content || "",
      category: article.category || "general",
      imageUrl: article.image_url || undefined, 
      author: article.author_name || "Unknown",
      authorId: article.user_id,
      contributors: article.contributors || 1,
      views: article.views || 0,
      lastUpdated: format(new Date(article.last_updated || article.created_at), 'MMM d, yyyy'),
      tags: article.tags || []
    })) as WikiArticle[];
    
    // Check if there are more articles to load
    const { count, error: countError } = await supabase
      .from('wiki_articles')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    const totalCount = count || 0;
    const hasMore = (page + 1) * pageSize < totalCount;
    
    return { articles: formattedArticles, hasMore, error: null };
  } catch (error) {
    console.error('Error fetching wiki articles:', error);
    return { articles: [], hasMore: false, error };
  }
};

// Fetch a single wiki article by ID
export const fetchWikiArticleById = async (articleId: string) => {
  try {
    const { data, error } = await supabase
      .from('wiki_articles')
      .select('*')
      .eq('id', articleId)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return { article: null, error: 'Article not found' };
    }
    
    // Convert to WikiArticle format
    const article: WikiArticle = {
      id: data.id,
      title: data.title,
      description: data.description || "",
      content: data.content || "",
      category: data.category || "general",
      imageUrl: data.image_url || undefined,
      author: data.author_name || "Unknown",
      authorId: data.user_id,
      contributors: data.contributors || 1,
      views: data.views || 0,
      lastUpdated: format(new Date(data.last_updated || data.created_at), 'MMM d, yyyy'),
      tags: data.tags || []
    };
    
    // Update view count
    const { error: updateError } = await supabase
      .from('wiki_articles')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', articleId);
    
    if (updateError) {
      console.error('Error updating view count:', updateError);
    }
    
    return { article, error: null };
  } catch (error) {
    console.error('Error fetching wiki article:', error);
    return { article: null, error };
  }
};

// Create a new wiki article
export const createWikiArticle = async (article: Partial<WikiArticle>, userId: string) => {
  try {
    // Get user profile info for author name
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('wiki_articles')
      .insert({
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.category,
        image_url: article.imageUrl,
        user_id: userId,
        author_name: userData?.name || 'Unknown',
        tags: article.tags || []
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert to WikiArticle format
    const createdArticle: WikiArticle = {
      id: data.id,
      title: data.title,
      description: data.description || "",
      content: data.content || "",
      category: data.category || "general",
      imageUrl: data.image_url || undefined,
      author: data.author_name || "Unknown",
      authorId: data.user_id,
      contributors: data.contributors || 1,
      views: data.views || 0,
      lastUpdated: format(new Date(data.created_at), 'MMM d, yyyy'),
      tags: data.tags || []
    };
    
    return { article: createdArticle, error: null };
  } catch (error) {
    console.error('Error creating wiki article:', error);
    return { article: null, error };
  }
};

// Update an existing wiki article
export const updateWikiArticle = async (
  articleId: string, 
  updates: Partial<WikiArticle>,
  userId: string
) => {
  try {
    // First check if this is a new contributor
    const { data: existing, error: fetchError } = await supabase
      .from('wiki_articles')
      .select('user_id, contributors')
      .eq('id', articleId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Determine if this is a new contributor
    const isNewContributor = existing.user_id !== userId;
    const contributors = isNewContributor ? (existing.contributors || 1) + 1 : existing.contributors;
    
    // Update the article
    const { data, error } = await supabase
      .from('wiki_articles')
      .update({
        title: updates.title,
        description: updates.description,
        content: updates.content,
        category: updates.category,
        image_url: updates.imageUrl,
        tags: updates.tags,
        contributors,
        last_updated: new Date().toISOString()
      })
      .eq('id', articleId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Convert to WikiArticle format
    const updatedArticle: WikiArticle = {
      id: data.id,
      title: data.title,
      description: data.description || "",
      content: data.content || "",
      category: data.category || "general",
      imageUrl: data.image_url || undefined,
      author: data.author_name || "Unknown",
      authorId: data.user_id,
      contributors: data.contributors || 1,
      views: data.views || 0,
      lastUpdated: format(new Date(data.last_updated), 'MMM d, yyyy'),
      tags: data.tags || []
    };
    
    return { article: updatedArticle, error: null };
  } catch (error) {
    console.error('Error updating wiki article:', error);
    return { article: null, error };
  }
};
