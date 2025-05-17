
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DiscussionTopic } from "@/lib/discussions-utils";

export const useForumData = () => {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<DiscussionTopic[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<DiscussionTopic[]>([]);
  const [sortOption, setSortOption] = useState<'popular' | 'new' | 'upvotes'>('popular');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  // Fetch real forum data
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch forum posts with author profile information
        const { data, error } = await supabase
          .from('forum_posts')
          .select(`
            id, 
            title, 
            content,
            created_at, 
            tags, 
            upvotes, 
            views, 
            comments, 
            is_pinned,
            user_id,
            profiles:user_id(name, avatar_url)
          `)
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform data to match the DiscussionTopic interface
        if (data && Array.isArray(data)) {
          // Safe type casting to interface
          interface ForumPost {
            id: string;
            title: string;
            content: string;
            user_id: string;
            created_at: string;
            tags?: string[];
            upvotes: number;
            views: number;
            comments: number;
            is_pinned: boolean;
            profiles?: {
              name?: string;
              avatar_url?: string;
            } | null;
          }
          
          const formattedData: DiscussionTopic[] = (data as ForumPost[]).map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.profiles?.name || 'Anonymous',
            authorId: post.user_id,
            authorAvatar: post.profiles?.avatar_url,
            createdAt: new Date(post.created_at),
            tags: post.tags,
            upvotes: post.upvotes || 0,
            views: post.views || 0,
            comments: post.comments || 0,
            isPinned: post.is_pinned || false,
            isPopular: (post.comments || 0) > 5 || (post.views || 0) > 50
          }));
          
          // Extract unique tags
          const tags = Array.from(
            new Set(formattedData.flatMap(post => post.tags || []))
          );
          
          setAllTags(tags);
          setDiscussions(formattedData);
          
          if (formattedData.length === 0) {
            toast({
              description: "No forum posts found. Be the first to create a discussion!",
              variant: "default"
            });
          }
        } else {
          // Handle empty or invalid data
          setDiscussions([]);
          setAllTags([]);
          toast({
            description: "No forum posts found. Be the first to create a discussion!",
            variant: "default"
          });
        }
      } catch (err) {
        console.error('Error fetching discussions:', err);
        toast({
          title: "Error",
          description: "Failed to load forum discussions",
          variant: "destructive"
        });
        
        // Fallback to empty array
        setDiscussions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiscussions();
  }, [toast]);
  
  // Filter and sort discussions
  useEffect(() => {
    let result = [...discussions];
    
    // Apply tag filtering
    if (activeTag) {
      result = result.filter(discussion => 
        discussion.tags && discussion.tags.includes(activeTag)
      );
    }
    
    // Apply search filtering
    if (searchTerm) {
      result = result.filter(discussion => 
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (discussion.tags && discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'new':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'upvotes':
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'popular':
      default:
        // Sort by pinned first, then by a combination of comments, views and upvotes
        result.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          const aPopularity = a.comments * 3 + a.views + a.upvotes * 2;
          const bPopularity = b.comments * 3 + b.views + b.upvotes * 2;
          return bPopularity - aPopularity;
        });
        break;
    }
    
    setFilteredDiscussions(result);
  }, [discussions, sortOption, activeTag, searchTerm]);

  // Add a new discussion to the local state
  const addDiscussion = (newPost: DiscussionTopic) => {
    setDiscussions(prevDiscussions => [newPost, ...prevDiscussions]);
  };
  
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
    allTags,
    addDiscussion
  };
};
