
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDaysAgo(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export const disciplines = [
  "Mathematics & Logic",
  "Physics & Astronomy",
  "Philosophy & Ethics",
  "Computer Science",
  "Literature & Arts",
  "History & Anthropology",
  "Biology & Medicine",
  "Psychology & Cognition",
  "Economics & Game Theory",
  "Chemistry & Material Science",
  "Linguistics & Languages",
  "Political Science & Law"
];

export const learningMethods = [
  "Feynman Technique",
  "Spaced Repetition",
  "Deep Work Method",
  "Interdisciplinary Learning",
  "Dual Coding Theory",
  "Mind Mapping",
  "Active Recall",
  "Conceptual Models",
  "Distributed Practice",
  "Interleaving",
  "Elaborative Interrogation",
  "Self-Explanation"
];

export const userSettings = {
  learningPreferences: {
    topics: [] as string[],
    methods: [] as string[],
    difficulty: "intermediate" as "beginner" | "intermediate" | "advanced"
  },
  notificationPreferences: {
    email: true,
    pushNotifications: true,
    weeklyDigest: true,
    mentorshipRequests: true,
    forumReplies: true,
    newContent: true
  }
};

