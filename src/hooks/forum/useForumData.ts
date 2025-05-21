
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DiscussionTopic } from "@/lib/discussions-utils";

export const useForumData = () => {
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<DiscussionTopic[]>([]);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Fetch data function that can be called to refetch
  const fetchDiscussions = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      // Query forum posts
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles:user_id(name, username, avatar_url)
        `);
      
      if (error) {
        console.error("Error fetching discussions:", error);
        setError("Failed to load discussions. Please try again later.");
        setIsError(true);
        return;
      }
      
      // Process the data and collect tags
      const allTagsSet = new Set<string>();
      const processedData: DiscussionTopic[] = data.map((post: any) => {
        // Add tags to tag set
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag: string) => allTagsSet.add(tag));
        }
        
        // Extract author info from the joined profiles data
        const authorInfo = post.profiles;
        
        // Determine if post is popular based on views & comments
        const isPopular = (post.views || 0) > 50 || (post.comments || 0) > 5;
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.user_id,
          author: authorInfo?.name || authorInfo?.username || 'Unknown User',
          authorAvatar: authorInfo?.avatar_url,
          createdAt: new Date(post.created_at),
          tags: post.tags || [],
          views: post.views || 0,
          upvotes: post.upvotes || 0,
          comments: post.comments || 0,
          isPinned: post.is_pinned || false,
          isPopular: isPopular,
        };
      });
      
      setDiscussions(processedData);
      setAllTags(Array.from(allTagsSet));
    } catch (err) {
      console.error("Exception in fetching discussions:", err);
      setError("An unexpected error occurred. Please try again later.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...discussions];
    
    // Apply tag filter
    if (activeTag) {
      result = result.filter(discussion => 
        discussion.tags && discussion.tags.includes(activeTag)
      );
    }
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        discussion =>
          discussion.title.toLowerCase().includes(searchLower) ||
          discussion.content.toLowerCase().includes(searchLower) ||
          (typeof discussion.author === 'string' && discussion.author.toLowerCase().includes(searchLower)) ||
          (discussion.tags && discussion.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'upvotes':
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'views':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'comments':
        result.sort((a, b) => b.comments - a.comments);
        break;
      default:
        break;
    }
    
    // Pin pinned discussions to the top
    const pinned = result.filter(d => d.isPinned);
    const notPinned = result.filter(d => !d.isPinned);
    result = [...pinned, ...notPinned];
    
    setFilteredDiscussions(result);
  }, [discussions, activeTag, searchTerm, sortOption]);
  
  // Function to refetch the discussions
  const refetch = useCallback(() => {
    return fetchDiscussions();
  }, [fetchDiscussions]);
  
  return {
    discussions,
    filteredDiscussions,
    sortOption,
    setSortOption,
    activeTag,
    setActiveTag,
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
    error,
    refetch,
    allTags,
  };
};
