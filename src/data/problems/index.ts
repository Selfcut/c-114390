
import { Problem, getAvailableDomains, getProblemsByDomain, getProblemById } from './types';
import { worldProblems } from './worldProblems';
import { technologyProblems } from './technologyProblems';
import { healthProblems } from './healthProblems';
import { environmentProblems } from './environmentProblems';

// Combine all problem domains into a single array
export const problemsData: Problem[] = [
  ...worldProblems,
  ...technologyProblems,
  ...healthProblems,
  ...environmentProblems,
  // Add other domains here as they are created
];

// Export the helper functions that operate on the combined data
export const getAvailableDomainsFromData = (): Problem['domain'][] => {
  return getAvailableDomains(problemsData);
};

export const getProblemsByDomainFromData = (domain: Problem['domain']) => {
  return getProblemsByDomain(problemsData, domain);
};

export const getProblemByIdFromData = (id: number) => {
  return getProblemById(problemsData, id);
};

// Re-export the Problem type for convenience
export type { Problem };
