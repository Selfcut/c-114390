
import { supabase } from "@/integrations/supabase/client";
import { WikiArticle } from "@/components/wiki/types";

/**
 * Fetch wiki articles with filtering options
 */
export async function fetchWikiArticles({
  category = undefined,
  page = 0,
  pageSize = 9,
  sortBy = 'created_at',
  sortOrder = 'desc',
  searchQuery = ''
}: {
  category?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
}) {
  try {
    // Start building the query
    let query = supabase
      .from('wiki_articles')
      .select(`
        *,
        profiles:user_id(name, username, avatar_url)
      `)
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    // Apply category filter
    if (category) {
      query = query.eq('category', category);
    }
    
    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching wiki articles:', error);
      throw error;
    }
    
    // Transform to match the expected format with proper type safety
    const articles: WikiArticle[] = data?.map(article => {
      const profileData = article.profiles as any;
      
      return {
        ...article,
        author_name: profileData?.name || profileData?.username || 'Anonymous',
        created_at: new Date(article.created_at),
        last_updated: new Date(article.last_updated)
      };
    }) || [];

    return {
      articles,
      hasMore: articles.length === pageSize,
      error: null
    };
  } catch (error) {
    console.error('Error in fetchWikiArticles:', error);
    
    // For development purposes, provide simulated data
    // This should be removed in production
    const simulatedArticles: WikiArticle[] = [
      {
        id: "1",
        title: "Phenomenology and Existentialism",
        description: "An exploration of two influential philosophical movements of the 20th century and their connections.",
        content: "Phenomenology, founded by Edmund Husserl, is the study of structures of consciousness as experienced from the first-person point of view...",
        category: "Philosophy",
        tags: ["phenomenology", "existentialism", "continental-philosophy"],
        user_id: "user-123",
        author_name: "PhilosophyProfessor",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        contributors: 3,
        views: 156,
        image_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=2787&q=80"
      },
      {
        id: "2",
        title: "Understanding Stoicism",
        description: "A comprehensive guide to Stoic philosophy and its practical applications in modern life.",
        content: "Stoicism is a school of Hellenistic philosophy founded by Zeno of Citium in Athens in the early 3rd century BC...",
        category: "Philosophy",
        tags: ["stoicism", "ethics", "virtue"],
        user_id: "user-456",
        author_name: "StoicMind",
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        contributors: 2,
        views: 98,
        image_url: "https://images.unsplash.com/photo-1618477461853-cf177663d8d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
      },
      {
        id: "3",
        title: "The Philosophy of Mind",
        description: "Exploring consciousness, mental states, and the mind-body problem.",
        content: "Philosophy of mind is a branch of philosophy that studies the ontology and nature of the mind and its relationship with the body...",
        category: "Philosophy",
        tags: ["mind", "consciousness", "dualism", "materialism"],
        user_id: "user-789",
        author_name: "ConsciousThinker",
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        last_updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        contributors: 5,
        views: 210,
        image_url: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80"
      }
    ];
    
    return {
      articles: simulatedArticles,
      hasMore: false,
      error
    };
  }
}

/**
 * Get a specific wiki article by ID
 */
export async function getWikiArticle(id: string) {
  try {
    const { data, error } = await supabase
      .from('wiki_articles')
      .select(`
        *,
        profiles:user_id(name, username, avatar_url)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Handle profiles data safely
    const profileData = data.profiles as any;
    
    // Transform to match the expected format
    const article: WikiArticle = {
      ...data,
      author_name: profileData?.name || profileData?.username || 'Anonymous',
      created_at: new Date(data.created_at),
      last_updated: new Date(data.last_updated)
    };
    
    return { article, error: null };
  } catch (error) {
    console.error('Error fetching wiki article:', error);
    return { article: null, error };
  }
}

/**
 * Create a new wiki article
 */
export async function createWikiArticle({
  title,
  description,
  content,
  category,
  tags = [],
  userId,
  imageUrl
}: {
  title: string;
  description: string;
  content: string;
  category: string;
  tags?: string[];
  userId: string;
  imageUrl?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('wiki_articles')
      .insert({
        title,
        description,
        content,
        category,
        tags,
        user_id: userId,
        image_url: imageUrl,
        contributors: 1,
        views: 0
      })
      .select();
      
    if (error) throw error;
    
    return { article: data?.[0], error: null };
  } catch (error) {
    console.error('Error creating wiki article:', error);
    return { article: null, error };
  }
}
