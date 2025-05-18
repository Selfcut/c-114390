
export interface Problem {
  id: number;
  title: string;
  description: string;
  severity: number; // 1-10 scale
  urgency: number; // 1-10 scale
  solvability: number; // 1-10 scale (lower = harder to solve)
  categories: string[];
  discussions?: number;
  solutions?: number;
}

export const problemsData: Problem[] = [
  {
    id: 1,
    title: "Climate Change and Global Warming",
    description: "Rising global temperatures are causing extreme weather events, sea level rise, and ecosystem disruption.",
    severity: 10,
    urgency: 9,
    solvability: 4,
    categories: ["Environment", "Global"]
  },
  {
    id: 2,
    title: "Wealth Inequality",
    description: "The growing gap between rich and poor threatens social stability and economic opportunity.",
    severity: 8,
    urgency: 7,
    solvability: 5,
    categories: ["Economics", "Social"]
  },
  {
    id: 3,
    title: "Global Food Security",
    description: "Ensuring adequate nutrition for a growing world population while resources become constrained.",
    severity: 9,
    urgency: 8,
    solvability: 6,
    categories: ["Food", "Global", "Health"]
  },
  {
    id: 4,
    title: "Antibiotic Resistance",
    description: "The growing ineffectiveness of antibiotics threatens to undermine modern medicine.",
    severity: 9,
    urgency: 7,
    solvability: 5,
    categories: ["Health", "Science"]
  },
  {
    id: 5,
    title: "AI Alignment",
    description: "Ensuring that advanced AI systems remain safe, beneficial, and aligned with human values.",
    severity: 9,
    urgency: 7,
    solvability: 3,
    categories: ["Technology", "Ethics"]
  },
  {
    id: 6,
    title: "Plastic Pollution",
    description: "Rapidly accumulating plastic waste is contaminating oceans and threatening ecosystems.",
    severity: 8,
    urgency: 8,
    solvability: 7,
    categories: ["Environment", "Pollution"]
  },
  {
    id: 7,
    title: "Access to Clean Water",
    description: "Many communities worldwide lack access to safe drinking water and sanitation.",
    severity: 9,
    urgency: 9,
    solvability: 6,
    categories: ["Health", "Infrastructure", "Basic Needs"]
  },
  {
    id: 8,
    title: "Biodiversity Loss",
    description: "Rapid extinction of plant and animal species threatens ecosystem stability.",
    severity: 9,
    urgency: 8,
    solvability: 5,
    categories: ["Environment", "Ecology"]
  },
  {
    id: 9,
    title: "Digital Privacy",
    description: "Balancing technological advancement with protection of personal data and privacy rights.",
    severity: 7,
    urgency: 8,
    solvability: 6,
    categories: ["Technology", "Rights", "Governance"]
  },
  {
    id: 10,
    title: "Pandemic Preparedness",
    description: "Building global systems to detect, prevent, and respond to future pandemics.",
    severity: 9,
    urgency: 8,
    solvability: 7,
    categories: ["Health", "Global", "Governance"]
  }
];
