
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDaysAgo(date: Date): string {
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
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 5) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}

export const disciplines = [
  {
    id: "math",
    title: "Mathematics & Logic",
    subtitle: "Foundational Thinking",
    imagePath: "/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png",
    isNew: true,
    difficulty: "intermediate",
    popularity: 89,
    description: "Explore the foundations of logical reasoning and mathematical principles that underpin all other disciplines."
  },
  {
    id: "physics",
    title: "Physics & Astronomy",
    subtitle: "Natural Sciences",
    imagePath: "/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png",
    isNew: false,
    difficulty: "advanced",
    popularity: 92,
    description: "Discover the fundamental laws governing our universe from quantum particles to cosmic structures."
  },
  {
    id: "philosophy",
    title: "Philosophy & Ethics",
    subtitle: "Conceptual Frameworks",
    imagePath: "/lovable-uploads/0c6db754-b805-46e5-a4b8-319a9d8fef71.png",
    isNew: false,
    difficulty: "intermediate",
    popularity: 78,
    description: "Examine perspectives on existence, knowledge, values, and the fundamental nature of reality."
  },
  {
    id: "cs",
    title: "Computer Science",
    subtitle: "Computational Thinking",
    imagePath: "/lovable-uploads/12cd0679-f352-498e-a6ad-9faaa1ffbec9.png",
    isNew: false,
    difficulty: "beginner",
    popularity: 95,
    description: "Learn about algorithms, data structures, and computational systems that power modern technology."
  },
  {
    id: "literature",
    title: "Literature & Arts",
    subtitle: "Creative Expression",
    imagePath: "/lovable-uploads/142dea30-a410-4e79-84d0-70189e8fcd07.png",
    isNew: false,
    difficulty: "beginner",
    popularity: 72,
    description: "Study literary works and artistic expressions that have shaped human culture throughout history."
  },
  {
    id: "history",
    title: "History & Anthropology",
    subtitle: "Human Evolution",
    imagePath: "/lovable-uploads/d16f3783-6af1-4327-8936-c5a50eb0cab5.png",
    isNew: false,
    difficulty: "intermediate",
    popularity: 81,
    description: "Trace the development of human societies, cultures, and civilizations across time."
  },
  {
    id: "biology",
    title: "Biology & Medicine",
    subtitle: "Life Sciences",
    imagePath: "/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png",
    isNew: false,
    difficulty: "advanced",
    popularity: 88,
    description: "Investigate the principles of life from molecular foundations to complex ecosystems."
  },
  {
    id: "psychology",
    title: "Psychology & Cognition",
    subtitle: "Mind Sciences",
    imagePath: "/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png",
    isNew: false,
    difficulty: "intermediate",
    popularity: 90,
    description: "Study mental processes, behavior, and the neurological foundations of consciousness."
  },
  {
    id: "alchemy",
    title: "Alchemy",
    subtitle: "Transformative Arts",
    imagePath: "/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png",
    isNew: true,
    difficulty: "advanced",
    popularity: 76,
    description: "The ancient practice of transmutation and spiritual growth through manipulating matter."
  },
  {
    id: "hermeticism",
    title: "Hermeticism",
    subtitle: "Esoteric Philosophy",
    imagePath: "/lovable-uploads/b67f802d-430a-4e5a-8755-b61e10470d58.png",
    isNew: false,
    difficulty: "advanced",
    popularity: 72,
    description: "The esoteric tradition based on writings attributed to Hermes Trismegistus."
  },
  {
    id: "gnosticism",
    title: "Gnosticism",
    subtitle: "Divine Knowledge",
    imagePath: "/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png",
    isNew: false,
    difficulty: "intermediate",
    popularity: 68,
    description: "Ancient spiritual knowledge emphasizing direct experience of divinity within."
  },
  {
    id: "kabbalah",
    title: "Kabbalah",
    subtitle: "Jewish Mysticism",
    imagePath: "/lovable-uploads/4255fa40-8036-4424-a210-e3bcd99754df.png",
    isNew: false,
    difficulty: "advanced",
    popularity: 65,
    description: "Jewish mystical tradition offering a symbolic understanding of divine nature."
  },
  {
    id: "astrology",
    title: "Astrology",
    subtitle: "Celestial Influences",
    imagePath: "/lovable-uploads/92333427-5a32-4cf8-b110-afc5b57c9f27.png",
    isNew: false,
    difficulty: "intermediate",
    popularity: 87,
    description: "The study of celestial bodies' movements and their influence on human affairs."
  },
  {
    id: "sacred-geometry",
    title: "Sacred Geometry",
    subtitle: "Divine Patterns",
    imagePath: "/lovable-uploads/e565a3ea-dc96-4344-a533-62026d4245e1.png",
    isNew: true,
    difficulty: "intermediate",
    popularity: 82,
    description: "Mathematical patterns that recur throughout the universe and in sacred art."
  }
];

export const mysticalBooks = [
  {
    id: "alchemists-path",
    title: "The Alchemist's Path",
    author: "Alexandria Hermes",
    cover: "/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png",
    rating: 4.8,
    description: "A modern guide to practical alchemy and spiritual transformation.",
    pages: 312,
    published: "2021",
    category: "Alchemy"
  },
  {
    id: "shadows-of-anubis",
    title: "Shadows of Anubis",
    author: "Imhotep Khai",
    cover: "/lovable-uploads/d16f3783-6af1-4327-8936-c5a50eb0cab5.png",
    rating: 4.9,
    description: "Journey through the Egyptian afterlife and the mysteries of death and rebirth.",
    pages: 428,
    published: "2019",
    category: "Ancient Wisdom"
  },
  {
    id: "ninth-dot",
    title: "The Ninth Dot",
    author: "Sophia Luz",
    cover: "/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png",
    rating: 4.7,
    description: "Exploring the Council of Nine Dots and their influence throughout history.",
    pages: 256,
    published: "2022",
    category: "Mysticism"
  }
];

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function calculateReadingProgress(
  currentPosition: number, 
  totalLength: number
): number {
  return Math.min(100, Math.round((currentPosition / totalLength) * 100));
}

export function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const difficultyMap = {
  beginner: { 
    label: "Beginner", 
    color: "bg-green-700" 
  },
  intermediate: { 
    label: "Intermediate", 
    color: "bg-blue-700" 
  },
  advanced: { 
    label: "Advanced", 
    color: "bg-purple-700" 
  }
};

export const studyMethods = [
  {
    id: "feynman",
    name: "Feynman Technique",
    description: "Learn by teaching concepts in simple terms",
    effectiveness: 92
  },
  {
    id: "spaced",
    name: "Spaced Repetition",
    description: "Review information at increasing intervals",
    effectiveness: 89
  },
  {
    id: "pomodoro",
    name: "Pomodoro Method",
    description: "Focus for 25 minutes, then take a 5 minute break",
    effectiveness: 85
  },
  {
    id: "mindmapping",
    name: "Mind Mapping",
    description: "Visualize connections between concepts",
    effectiveness: 78
  },
  {
    id: "active-recall",
    name: "Active Recall",
    description: "Test yourself rather than passively reviewing",
    effectiveness: 95
  }
];
