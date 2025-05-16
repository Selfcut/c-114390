
import { supabase } from "@/integrations/supabase/client";

// Define the discussion topic interface
export interface DiscussionTopic {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  tags?: string[];
  upvotes?: number;
  views?: number;
  replies?: number;
  excerpt?: string;
  content?: string;
  isPinned?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

// Function to format time ago for display
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "Just now";
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
};

// Mock discussions data (used as a fallback)
export const mockDiscussions: DiscussionTopic[] = [
  {
    id: "1",
    title: "Exploring the intersection of quantum physics and consciousness",
    author: "QuantumThinker",
    authorAvatar: "",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    tags: ["Quantum Physics", "Consciousness", "Philosophy"],
    upvotes: 42,
    replies: 13,
    views: 156,
    content: "I've been diving deep into the fascinating intersection between quantum physics and consciousness. The observer effect suggests that the act of observation impacts what's being observed at a quantum level. Does this imply consciousness plays a fundamental role in the fabric of reality?",
    isPinned: true
  },
  {
    id: "2",
    title: "Mathematical models for understanding complex adaptive systems",
    author: "ComplexityScholar",
    authorAvatar: "",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    tags: ["Mathematics", "Complex Systems", "Modeling"],
    upvotes: 29,
    replies: 7,
    views: 98,
    content: "Complex adaptive systems exist throughout nature and society - from ecosystems to economies. I'm working on mathematical models that might help us better understand these systems. Has anyone explored using fractals and power laws to model emergent behaviors?",
    isNew: true
  },
  {
    id: "3",
    title: "The role of metaphor in scientific discovery",
    author: "CognitivePoet",
    authorAvatar: "",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    tags: ["Philosophy of Science", "Language", "Cognition"],
    upvotes: 68,
    replies: 24,
    views: 224,
    content: "Throughout history, metaphors have played a crucial role in scientific breakthroughs. From Darwin's 'tree of life' to Bohr's 'planetary' model of the atom, metaphorical thinking seems essential to conceptual innovation. How do these linguistic bridges between domains enable new discoveries?",
    isPopular: true
  },
  {
    id: "4",
    title: "Integrating Eastern and Western approaches to consciousness",
    author: "MindfulIntegrator",
    authorAvatar: "",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    tags: ["Consciousness", "Philosophy", "Cognitive Science"],
    upvotes: 35,
    replies: 16,
    views: 143,
    content: "Western science approaches consciousness through neuroscience and cognitive models, while Eastern traditions have millennia of meditation-based insights. How might we create a framework that integrates both empirical third-person and experiential first-person perspectives on consciousness?"
  },
  {
    id: "5",
    title: "Emergence of intelligence in decentralized systems",
    author: "ComplexityEngineer",
    authorAvatar: "",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    tags: ["AI", "Complex Systems", "Emergence"],
    upvotes: 47,
    replies: 19,
    views: 185,
    content: "From ant colonies to neural networks, intelligence can emerge from simple units following basic rules with no centralized control. What principles govern this emergence? Can we design better AI systems by mimicking these natural emergent processes rather than top-down approaches?"
  }
];

// Function to sort discussions based on the specified option
export const getSortedDiscussions = (
  discussions: DiscussionTopic[], 
  sortOption: 'popular' | 'new' | 'upvotes'
): DiscussionTopic[] => {
  let sortedDiscussions = [...discussions];
  
  // First, always place pinned discussions at the top
  sortedDiscussions.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
  
  // Then apply the selected sort option
  switch (sortOption) {
    case 'new':
      return sortedDiscussions.sort((a, b) => {
        if (a.isPinned && b.isPinned || !a.isPinned && !b.isPinned) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
    case 'upvotes':
      return sortedDiscussions.sort((a, b) => {
        if (a.isPinned && b.isPinned || !a.isPinned && !b.isPinned) {
          return (b.upvotes || 0) - (a.upvotes || 0);
        }
        return 0;
      });
    case 'popular':
    default:
      return sortedDiscussions.sort((a, b) => {
        if (a.isPinned && b.isPinned || !a.isPinned && !b.isPinned) {
          // Popular is a combination of recency, upvotes, and views
          const aScore = (a.upvotes || 0) * 2 + (a.views || 0) / 10 + (a.replies || 0) * 3;
          const bScore = (b.upvotes || 0) * 2 + (b.views || 0) / 10 + (b.replies || 0) * 3;
          return bScore - aScore;
        }
        return 0;
      });
  }
};

// Function to filter discussions by tag
export const filterDiscussionsByTag = (discussions: DiscussionTopic[], tag: string): DiscussionTopic[] => {
  return discussions.filter(discussion => discussion.tags?.includes(tag));
};

// Function to fetch discussions from Supabase (for future implementation)
export const fetchDiscussions = async (): Promise<DiscussionTopic[]> => {
  try {
    // This is a placeholder for future Supabase integration
    // For now, return mock data
    return mockDiscussions;
    
    // When Supabase tables are set up, the function would look like this:
    /*
    const { data, error } = await supabase
      .from('discussions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching discussions:', error);
      return mockDiscussions;
    }
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      author: item.author,
      authorAvatar: item.author_avatar,
      createdAt: new Date(item.created_at),
      tags: item.tags,
      upvotes: item.upvotes,
      replies: item.replies,
      views: item.views,
      content: item.content,
      isPinned: item.is_pinned,
      isNew: (new Date().getTime() - new Date(item.created_at).getTime()) < 24 * 60 * 60 * 1000,
      isPopular: item.views > 100 || item.upvotes > 30
    }));
    */
  } catch (error) {
    console.error('Error in fetchDiscussions:', error);
    return mockDiscussions;
  }
};
