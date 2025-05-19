
import { Problem } from './types';

export const technologyProblems: Problem[] = [
  // TECHNOLOGY DOMAIN - TOP PROBLEMS
  {
    id: 101,
    title: "AI Alignment",
    description: "Ensuring that advanced AI systems remain safe, beneficial, and aligned with human values.",
    longDescription: "AI alignment refers to the challenge of ensuring that artificial intelligence systems act in accordance with human intentions and values, even as they become increasingly capable and autonomous. As AI systems become more powerful, the risk increases that they might optimize for objectives that don't fully capture what humans care about, potentially leading to harmful outcomes.",
    severity: 9,
    urgency: 7,
    solvability: 3,
    categories: ["Technology", "Ethics", "Future"],
    domain: "technology",
    rank: 1,
    impact: "Poorly aligned AI could cause harm through unintended consequences, even without malicious intent. Superintelligent AI systems optimizing for misspecified goals could be catastrophic. Systems that manipulate humans or resist being turned off could undermine human autonomy. Economic and political power could be concentrated in the hands of those who control advanced AI.",
    challenges: "Precisely specifying human values is extraordinarily difficult. As AI becomes more general and capable, its behavior becomes harder to predict. There are economic and geopolitical incentives to deploy AI systems quickly, potentially before alignment problems are solved. Technical AI alignment research is still nascent.",
    potentialSolutions: "Technical research on interpretability, robustness, and verification of AI systems. Development of methods to elicit and represent human values accurately. Gradual deployment with extensive testing rather than deploying the most powerful systems immediately. International coordination and governance frameworks for AI development. Establishing appropriate oversight mechanisms.",
    resourceLinks: [
      { title: "AI Alignment Forum", url: "https://www.alignmentforum.org/" },
      { title: "Anthropic's Constitutional AI Research", url: "https://www.anthropic.com/research" },
      { title: "Future of Life Institute", url: "https://futureoflife.org/ai-policy/" }
    ]
  },
  {
    id: 102,
    title: "Cybersecurity Vulnerabilities",
    description: "Growing threats to digital infrastructure as society becomes increasingly dependent on networked systems.",
    severity: 8,
    urgency: 9,
    solvability: 6,
    categories: ["Technology", "Security", "Infrastructure"],
    domain: "technology",
    rank: 2
  },
  {
    id: 103,
    title: "Digital Privacy Erosion",
    description: "Increasing surveillance and data collection threatening personal privacy and autonomy.",
    severity: 8,
    urgency: 8,
    solvability: 6,
    categories: ["Technology", "Privacy", "Rights"],
    domain: "technology",
    rank: 3
  },
  {
    id: 104,
    title: "Information Ecosystem Degradation",
    description: "Proliferation of misinformation and algorithmic filter bubbles undermining shared reality.",
    severity: 7,
    urgency: 8,
    solvability: 5,
    categories: ["Technology", "Media", "Society"],
    domain: "technology",
    rank: 4
  },
  {
    id: 105,
    title: "Autonomous Weapons Systems",
    description: "Development of lethal autonomous weapons raising ethical and security concerns.",
    severity: 8,
    urgency: 7,
    solvability: 6,
    categories: ["Technology", "Military", "Ethics"],
    domain: "technology",
    rank: 5
  }
];
