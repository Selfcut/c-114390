
export interface DiscussionTopic {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  replies: number;
  createdAt: Date;
  tags: string[];
  upvotes: number;
}

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 5) {
    return `${diffInWeeks}w ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

export const mockDiscussions: DiscussionTopic[] = [
  {
    id: "1",
    title: "The intersection of quantum physics and consciousness",
    author: "PhilosophicalMind",
    replies: 24,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tags: ["Physics", "Philosophy", "Consciousness"],
    upvotes: 18
  },
  {
    id: "2",
    title: "Mathematical patterns in natural phenomena",
    author: "MathExplorer",
    replies: 18,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    tags: ["Mathematics", "Nature", "Patterns"],
    upvotes: 15
  },
  {
    id: "3",
    title: "Ethical implications of AI advancement",
    author: "EthicsScholar",
    replies: 32,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    tags: ["Ethics", "AI", "Technology"],
    upvotes: 27
  },
  {
    id: "4",
    title: "The role of literature in shaping societal values",
    author: "LiteraryAnalyst",
    replies: 21,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    tags: ["Literature", "Society", "Values"],
    upvotes: 14
  },
  {
    id: "5",
    title: "Neuroplasticity and lifelong learning potential",
    author: "BrainScientist",
    replies: 29,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    tags: ["Neuroscience", "Learning", "Psychology"],
    upvotes: 31
  },
  {
    id: "6",
    title: "The future of interdisciplinary research methodologies",
    author: "ResearchInnovator",
    replies: 15,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    tags: ["Research", "Methodology", "Interdisciplinary"],
    upvotes: 12
  }
];

export const getSortedDiscussions = (
  discussions: DiscussionTopic[],
  sortBy: 'popular' | 'new' | 'upvotes'
): DiscussionTopic[] => {
  switch (sortBy) {
    case 'new':
      return [...discussions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case 'popular':
      return [...discussions].sort((a, b) => b.replies - a.replies);
    case 'upvotes':
      return [...discussions].sort((a, b) => b.upvotes - a.upvotes);
    default:
      return discussions;
  }
};

export const filterDiscussionsByTag = (
  discussions: DiscussionTopic[],
  tag: string | null
): DiscussionTopic[] => {
  if (!tag) return discussions;
  return discussions.filter(discussion => discussion.tags.includes(tag));
};
