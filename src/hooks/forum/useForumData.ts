
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DiscussionTopic } from "@/lib/discussions-utils";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  // Fetch data function that can be called to refetch
  const fetchDiscussions = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      // Query forum posts without requiring a join for now to avoid foreign key issues
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*');
      
      if (error) {
        console.error("Error fetching discussions:", error);
        setError("Failed to load discussions. Please try again later.");
        setIsError(true);
        toast({
          title: "Error",
          description: "Failed to load discussions",
          variant: "destructive"
        });
        return;
      }
      
      // Fetch all profiles in a separate query to handle potential missing profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url');
        
      // Create a map of profiles by ID for quick lookup
      const profilesMap: Record<string, any> = {};
      if (profilesData) {
        profilesData.forEach((profile: any) => {
          profilesMap[profile.id] = profile;
        });
      }
      
      // Process the data and collect tags
      const allTagsSet = new Set<string>();
      const processedData: DiscussionTopic[] = data.map((post: any) => {
        // Add tags to tag set
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag: string) => allTagsSet.add(tag));
        }
        
        // Look up author info from the profiles map
        const authorProfile = profilesMap[post.user_id];
        const authorName = authorProfile?.name || authorProfile?.username || 'Unknown User';
        const authorAvatar = authorProfile?.avatar_url || 
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
        
        // Determine if post is popular based on views & comments
        const isPopular = (post.views || 0) > 50 || (post.comments || 0) > 5;
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.user_id,
          author: authorName,
          authorAvatar: authorAvatar,
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
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
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
