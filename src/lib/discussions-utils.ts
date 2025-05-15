export interface DiscussionTopic {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  date: string;
  tags: string[];
  upvotes: number;
  replies: number;
  views: number;
  isPinned?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  excerpt: string;
}

export const mockDiscussions: DiscussionTopic[] = [
  {
    id: '1',
    title: 'The Nature of Consciousness and Its Philosophical Implications',
    author: 'PhilosophyMind',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhilosophyMind',
    date: '2023-11-15',
    tags: ['Philosophy', 'Consciousness', 'Mind'],
    upvotes: 128,
    replies: 42,
    views: 1024,
    isPinned: true,
    isPopular: true,
    excerpt: 'An exploration of the hard problem of consciousness and its implications for our understanding of reality and the mind-body problem.'
  },
  {
    id: '2',
    title: 'Quantum Mechanics and the Observer Effect',
    author: 'QuantumExplorer',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuantumExplorer',
    date: '2023-11-12',
    tags: ['Physics', 'Quantum Mechanics', 'Science'],
    upvotes: 95,
    replies: 37,
    views: 876,
    isPopular: true,
    excerpt: 'Discussing the role of observation in quantum mechanics and how it challenges our classical understanding of reality.'
  },
  {
    id: '3',
    title: 'The Fermi Paradox: Where Is Everybody?',
    author: 'CosmicThinker',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CosmicThinker',
    date: '2023-11-10',
    tags: ['Astronomy', 'Extraterrestrial Life', 'Space'],
    upvotes: 87,
    replies: 29,
    views: 742,
    excerpt: 'Examining the contradiction between the high probability of extraterrestrial civilizations and the lack of contact or evidence.'
  },
  {
    id: '4',
    title: 'Emergence Theory and Complex Systems',
    author: 'ComplexityScience',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ComplexityScience',
    date: '2023-11-08',
    tags: ['Complexity', 'Systems Theory', 'Emergence'],
    upvotes: 76,
    replies: 23,
    views: 651,
    excerpt: 'How complex systems give rise to emergent properties that cannot be predicted from the behavior of individual components.'
  },
  {
    id: '5',
    title: 'The Ethics of Artificial Intelligence Development',
    author: 'EthicalTech',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EthicalTech',
    date: '2023-11-05',
    tags: ['AI', 'Ethics', 'Technology'],
    upvotes: 112,
    replies: 45,
    views: 932,
    isNew: true,
    excerpt: 'Discussing the moral implications and responsibilities in developing increasingly autonomous AI systems.'
  },
  {
    id: '6',
    title: 'Free Will in a Deterministic Universe',
    author: 'MetaphysicalMind',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MetaphysicalMind',
    date: '2023-11-03',
    tags: ['Philosophy', 'Free Will', 'Determinism'],
    upvotes: 92,
    replies: 38,
    views: 814,
    excerpt: 'Can free will exist in a universe governed by deterministic physical laws? Exploring compatibilism and libertarian perspectives.'
  },
  {
    id: '7',
    title: 'The Mathematics of Infinity and Beyond',
    author: 'MathExplorer',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MathExplorer',
    date: '2023-10-30',
    tags: ['Mathematics', 'Infinity', 'Set Theory'],
    upvotes: 68,
    replies: 21,
    views: 573,
    excerpt: 'Exploring different sizes of infinity, Cantor\'s diagonal argument, and the continuum hypothesis.'
  },
  {
    id: '8',
    title: 'The Evolution of Altruism: A Biological Paradox',
    author: 'EvolutionaryBiologist',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EvolutionaryBiologist',
    date: '2023-10-28',
    tags: ['Biology', 'Evolution', 'Altruism'],
    upvotes: 79,
    replies: 27,
    views: 682,
    isNew: true,
    excerpt: 'How does altruistic behavior evolve when natural selection favors self-interest? Examining kin selection and group selection theories.'
  },
  {
    id: '9',
    title: 'The Simulation Hypothesis: Are We Living in a Computer Simulation?',
    author: 'SimulationTheorist',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SimulationTheorist',
    date: '2023-10-25',
    tags: ['Philosophy', 'Technology', 'Reality'],
    upvotes: 103,
    replies: 41,
    views: 897,
    isPopular: true,
    excerpt: 'Examining the philosophical and scientific arguments for and against the simulation hypothesis proposed by Nick Bostrom.'
  },
  {
    id: '10',
    title: 'The Hard Problem of Consciousness: Qualia and Subjective Experience',
    author: 'ConsciousnessResearcher',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ConsciousnessResearcher',
    date: '2023-10-22',
    tags: ['Philosophy', 'Consciousness', 'Neuroscience'],
    upvotes: 89,
    replies: 34,
    views: 762,
    excerpt: 'Why explaining subjective experience is so difficult for science and philosophy. Exploring the explanatory gap between physical processes and qualia.'
  }
];

export const getSortedDiscussions = (discussions: DiscussionTopic[], sortOption: 'popular' | 'new' | 'upvotes'): DiscussionTopic[] => {
  const sortedDiscussions = [...discussions];
  
  switch (sortOption) {
    case 'popular':
      return sortedDiscussions.sort((a, b) => {
        // First sort by pinned status
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then by popularity
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        
        // Then by views
        return b.views - a.views;
      });
    
    case 'new':
      return sortedDiscussions.sort((a, b) => {
        // First sort by pinned status
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then by date (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    
    case 'upvotes':
      return sortedDiscussions.sort((a, b) => {
        // First sort by pinned status
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then by upvotes
        return b.upvotes - a.upvotes;
      });
    
    default:
      return sortedDiscussions;
  }
};

export const filterDiscussionsByTag = (discussions: DiscussionTopic[], tag: string): DiscussionTopic[] => {
  return discussions.filter(discussion => discussion.tags.includes(tag));
};

export const searchDiscussions = (discussions: DiscussionTopic[], query: string): DiscussionTopic[] => {
  const lowerCaseQuery = query.toLowerCase();
  
  return discussions.filter(discussion => 
    discussion.title.toLowerCase().includes(lowerCaseQuery) ||
    discussion.author.toLowerCase().includes(lowerCaseQuery) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
    discussion.excerpt.toLowerCase().includes(lowerCaseQuery)
  );
};
