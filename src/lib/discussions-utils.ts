export interface DiscussionTopic {
  id: string;
  title: string;
  author: string;
  tags: string[];
  replies: number;
  upvotes: number;
  createdAt: Date;
  excerpt?: string; // Adding the missing excerpt property as optional
}

export const mockDiscussions: DiscussionTopic[] = [
  {
    id: '1',
    title: 'The ethics of AI in education',
    author: 'Alice Johnson',
    tags: ['AI', 'Ethics', 'Education'],
    replies: 15,
    upvotes: 42,
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    excerpt: 'A discussion on the ethical implications of using AI in educational settings.'
  },
  {
    id: '2',
    title: 'The future of work in a decentralized world',
    author: 'Bob Williams',
    tags: ['DeFi', 'Future of Work', 'Technology'],
    replies: 8,
    upvotes: 28,
    createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
    excerpt: 'Exploring how decentralization is changing the way we work and the opportunities it presents.'
  },
  {
    id: '3',
    title: 'The role of philosophy in modern technology',
    author: 'Charlie Davis',
    tags: ['Philosophy', 'Technology', 'Society'],
    replies: 22,
    upvotes: 61,
    createdAt: new Date(Date.now() - 86400000 * 14), // 14 days ago
    excerpt: 'Examining the philosophical questions raised by modern technology and their impact on society.'
  },
  {
    id: '4',
    title: 'The impact of social media on mental health',
    author: 'Diana Evans',
    tags: ['Social Media', 'Mental Health', 'Psychology'],
    replies: 12,
    upvotes: 35,
    createdAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
    excerpt: 'Analyzing the effects of social media on our mental well-being and strategies for staying healthy.'
  },
  {
    id: '5',
    title: 'The science of consciousness',
    author: 'Ethan Foster',
    tags: ['Neuroscience', 'Consciousness', 'Science'],
    replies: 18,
    upvotes: 50,
    createdAt: new Date(Date.now() - 86400000 * 60), // 60 days ago
    excerpt: 'A deep dive into the scientific study of consciousness and the latest research in the field.'
  },
];

export const getSortedDiscussions = (
  discussions: DiscussionTopic[],
  sortBy: 'popular' | 'new' | 'upvotes'
): DiscussionTopic[] => {
  switch (sortBy) {
    case 'popular':
      return [...discussions].sort((a, b) => (b.replies + b.upvotes) - (a.replies + a.upvotes));
    case 'new':
      return [...discussions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case 'upvotes':
      return [...discussions].sort((a, b) => b.upvotes - a.upvotes);
    default:
      return discussions;
  }
};

export const filterDiscussionsByTag = (
  discussions: DiscussionTopic[],
  tag: string
): DiscussionTopic[] => {
  return discussions.filter(discussion => discussion.tags.includes(tag));
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};
