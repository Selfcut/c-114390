
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
    popularity: 89
  },
  {
    id: "physics",
    title: "Physics & Astronomy",
    subtitle: "Natural Sciences",
    imagePath: "/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png",
    isNew: false,
    difficulty: "advanced",
    popularity: 92
  },
  {
    id: "philosophy",
    title: "Philosophy & Ethics",
    subtitle: "Conceptual Frameworks",
    imagePath: "/lovable-uploads/0c6db754-b805-46e5-a4b8-319a9d8fef71.png",
    isNew: false,
    difficulty: "intermediate",
    popularity: 78
  },
  {
    id: "cs",
    title: "Computer Science",
    subtitle: "Computational Thinking",
    imagePath: "/lovable-uploads/12cd0679-f352-498e-a6ad-9faaa1ffbec9.png",
    isNew: false,
    difficulty: "beginner",
    popularity: 95
  },
  {
    id: "literature",
    title: "Literature & Arts",
    subtitle: "Creative Expression",
    imagePath: "/lovable-uploads/142dea30-a410-4e79-84d0-70189e8fcd07.png",
    isNew: false,
    difficulty: "beginner",
    popularity: 72
  },
  {
    id: "history",
    title: "History & Anthropology",
    subtitle: "Human Evolution",
    imagePath: "/lovable-uploads/d16f3783-6af1-4327-8936-c5a50eb0cab5.png",
    isNew: false,
    difficulty: "intermediate",
    popularity: 81
  },
  {
    id: "biology",
    title: "Biology & Medicine",
    subtitle: "Life Sciences",
    imagePath: "/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png",
    isNew: false,
    difficulty: "advanced",
    popularity: 88
  },
  {
    id: "psychology",
    title: "Psychology & Cognition",
    subtitle: "Mind Sciences",
    imagePath: "/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png",
    isNew: false,
    difficulty: "intermediate",
    popularity: 90
  }
];

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
