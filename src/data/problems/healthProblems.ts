
import { Problem } from './types';

export const healthProblems: Problem[] = [
  // HEALTH DOMAIN - TOP PROBLEMS
  {
    id: 201,
    title: "Antibiotic Resistance",
    description: "The growing ineffectiveness of antibiotics threatens to undermine modern medicine.",
    longDescription: "Antibiotic resistance occurs when bacteria evolve to survive treatment with antibiotics that once killed them. This natural process is accelerated by overuse and misuse of antibiotics in humans and animals. Without effective antibiotics, many common infections could become deadly again, and procedures like surgery or chemotherapy would carry much higher risks.",
    severity: 9,
    urgency: 8,
    solvability: 5,
    categories: ["Health", "Medicine", "Science"],
    domain: "health",
    rank: 1,
    impact: "Infections becoming harder or impossible to treat, leading to longer hospital stays and higher mortality. Increased healthcare costs from more expensive treatments and longer illnesses. Medical procedures becoming riskier without effective prophylactic antibiotics. Potential for untreatable pandemic bacterial infections.",
    challenges: "Economic incentives favor antibiotic overuse in medicine and agriculture. Pharmaceutical companies have limited incentive to develop new antibiotics due to poor return on investment. Diagnostic uncertainty leads to precautionary antibiotic prescription. International coordination is needed but difficult to achieve.",
    potentialSolutions: "New economic models to incentivize antibiotic development. Stricter regulation of antibiotic use in agriculture. Better diagnostic tests to determine when antibiotics are truly needed. Public education about appropriate antibiotic use. Investment in alternative treatments like phage therapy and antimicrobial peptides. Hospital infection control and antibiotic stewardship programs.",
    resourceLinks: [
      { title: "WHO Antimicrobial Resistance", url: "https://www.who.int/health-topics/antimicrobial-resistance" },
      { title: "CDC Antibiotic Resistance Threats Report", url: "https://www.cdc.gov/drugresistance/biggest-threats.html" },
      { title: "Review on Antimicrobial Resistance", url: "https://amr-review.org/" }
    ]
  },
  {
    id: 202,
    title: "Pandemic Preparedness",
    description: "Inadequate global systems to prevent, detect, and respond to emerging infectious diseases.",
    severity: 9,
    urgency: 8,
    solvability: 7,
    categories: ["Health", "Global", "Security"],
    domain: "health",
    rank: 2
  },
  {
    id: 203,
    title: "Healthcare Inequality",
    description: "Disparities in access to quality healthcare within and between countries.",
    severity: 8,
    urgency: 8,
    solvability: 6,
    categories: ["Health", "Inequality", "Social"],
    domain: "health",
    rank: 3
  },
  {
    id: 204,
    title: "Mental Health Crisis",
    description: "Growing prevalence of mental health disorders with inadequate support systems.",
    severity: 8,
    urgency: 8,
    solvability: 6,
    categories: ["Health", "Mental Health", "Social"],
    domain: "health",
    rank: 4
  },
  {
    id: 205,
    title: "Non-Communicable Diseases",
    description: "Rising burden of chronic conditions like heart disease, diabetes, and cancer.",
    severity: 8,
    urgency: 7,
    solvability: 6,
    categories: ["Health", "Medicine", "Lifestyle"],
    domain: "health",
    rank: 5
  }
];
