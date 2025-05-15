
export interface UserProfile {
  name: string;
  interests: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  readingGoal: number; // in minutes per day
  joinDate: Date;
}

export interface LearningProgress {
  discipline: string;
  completed: number; // percentage
  totalHours: number;
  streak: number; // consecutive days
  lastActivity: Date;
  nextMilestone: string;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  iconPath: string;
  dateEarned: Date;
  type: 'knowledge' | 'engagement' | 'contribution';
}

export const getProfileCompletion = (profile: Partial<UserProfile>): number => {
  let completionScore = 0;
  const totalFields = 5; // name, interests, level, readingGoal, joinDate
  
  if (profile.name) completionScore += 1;
  if (profile.interests && profile.interests.length > 0) completionScore += 1;
  if (profile.level) completionScore += 1;
  if (profile.readingGoal) completionScore += 1;
  if (profile.joinDate) completionScore += 1;
  
  return Math.floor((completionScore / totalFields) * 100);
};

export const getSuggestedPath = (interests: string[], level: string): { title: string; description: string }[] => {
  // This would typically come from an API based on user interests and level
  // Here's a simple implementation with mock data
  const paths = [
    {
      title: "Introduction to Systems Thinking",
      description: "Learn the fundamentals of analyzing complex systems across disciplines"
    },
    {
      title: "Mathematical Foundations",
      description: "Build core math skills essential for multiple scientific disciplines"
    },
    {
      title: "Philosophy of Science",
      description: "Explore the conceptual and methodological foundations of scientific inquiry"
    },
    {
      title: "Cognitive Science Fundamentals",
      description: "Understand how the mind works through multiple disciplinary lenses"
    },
    {
      title: "Complex Networks Analysis",
      description: "Study how networks appear in various domains from biology to sociology"
    }
  ];
  
  // Return a subset based on some simple logic (would be more sophisticated in practice)
  return paths.slice(0, 3);
};

export const mockProgress: LearningProgress[] = [
  {
    discipline: "Mathematics & Logic",
    completed: 65,
    totalHours: 24,
    streak: 12,
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    nextMilestone: "Advanced Set Theory"
  },
  {
    discipline: "Philosophy",
    completed: 38,
    totalHours: 16,
    streak: 7,
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    nextMilestone: "Ethics & Moral Philosophy"
  },
  {
    discipline: "Physics",
    completed: 27,
    totalHours: 12,
    streak: 3,
    lastActivity: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    nextMilestone: "Quantum Mechanics Basics"
  },
];

export const mockAchievements: AchievementBadge[] = [
  {
    id: "1",
    name: "Knowledge Explorer",
    description: "Studied content from 5 different disciplines",
    iconPath: "/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png",
    dateEarned: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    type: "knowledge"
  },
  {
    id: "2",
    name: "Active Contributor",
    description: "Made 10 valuable contributions to discussions",
    iconPath: "/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png",
    dateEarned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    type: "engagement"
  },
  {
    id: "3",
    name: "Streak Keeper",
    description: "Maintained a 7-day learning streak",
    iconPath: "/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png",
    dateEarned: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    type: "knowledge"
  },
];
