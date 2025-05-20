
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DiscussionTopic } from '@/lib/discussions-utils';
import { toast } from 'sonner';

export const useForumData = () => {
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<DiscussionTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('recent');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Fetch forum discussions
  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('forum_posts')
          .select(`
            *,
            profiles:user_id (
              id, 
              username,
              name,
              avatar_url
            )
          `);
        
        if (error) {
          console.error('Error fetching discussions:', error);
          toast.error('Failed to load forum discussions');
          setIsLoading(false);
          return;
        }
        
        // Extract all unique tags from the discussions
        const tags = new Set<string>();
        
        // Map the data to the DiscussionTopic format
        const formattedDiscussions: DiscussionTopic[] = data.map((post: any) => {
          // Add each tag to the set of all tags
          if (post.tags) {
            post.tags.forEach((tag: string) => tags.add(tag));
          }
          
          const now = new Date();
          const createdAt = new Date(post.created_at);
          const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          
          // Determine if post is popular based on upvotes and views
          const isPopular = post.upvotes > 5 || post.views > 20;
          
          return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.profiles?.name || post.profiles?.username || 'Anonymous',
            authorId: post.user_id,
            authorAvatar: post.profiles?.avatar_url,
            createdAt: createdAt,
            tags: post.tags || [],
            upvotes: post.upvotes || 0,
            views: post.views || 0,
            comments: post.comments || 0,
            isPinned: post.is_pinned || false,
            isNew: diffInHours < 24,
            isPopular
          };
        });
        
        setDiscussions(formattedDiscussions);
        setAllTags(Array.from(tags));
      } catch (error) {
        console.error('Error in fetchDiscussions:', error);
        toast.error('An error occurred while loading discussions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiscussions();
  }, []);
  
  // Filter and sort discussions based on user selections
  useEffect(() => {
    // Filter by tag and search term
    let filtered = [...discussions];
    
    if (activeTag) {
      filtered = filtered.filter(item => item.tags.includes(activeTag));
    }
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(lowerSearch) || 
        item.content.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'recent':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'most-viewed':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'most-commented':
        filtered.sort((a, b) => b.comments - a.comments);
        break;
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    // Always show pinned posts at the top
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
    
    setFilteredDiscussions(filtered);
  }, [discussions, sortOption, activeTag, searchTerm]);
  
  return {
    discussions,
    filteredDiscussions,
    isLoading,
    sortOption,
    setSortOption,
    activeTag,
    setActiveTag,
    searchTerm,
    setSearchTerm,
    allTags
  };
};
