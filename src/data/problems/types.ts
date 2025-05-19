
export interface Problem {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  severity: number; // 1-10 scale
  urgency: number; // 1-10 scale
  solvability: number; // 1-10 scale (lower = harder to solve)
  categories: string[];
  domain: 'world' | 'science' | 'physics' | 'philosophy' | 'technology' | 'social' | 'health' | 'environment';
  impact?: string;
  challenges?: string;
  potentialSolutions?: string;
  resourceLinks?: { title: string; url: string }[];
  discussions?: number;
  solutions?: number;
  rank?: number; // Rank within domain (1-100)
}

// Helper functions that will be used across all problem domains
export const getAvailableDomains = (problemsData: Problem[]): Problem['domain'][] => {
  const domains = new Set(problemsData.map(problem => problem.domain));
  return Array.from(domains) as Problem['domain'][];
};

export const getProblemsByDomain = (problemsData: Problem[], domain: Problem['domain']) => {
  return problemsData.filter(problem => problem.domain === domain).sort((a, b) => (a.rank || 999) - (b.rank || 999));
};

export const getProblemById = (problemsData: Problem[], id: number) => {
  return problemsData.find(problem => problem.id === id);
};
