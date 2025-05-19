
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

// The problems database - 100 problems per domain, sorted by priority
export const problemsData: Problem[] = [
  // WORLD DOMAIN - TOP PROBLEMS
  {
    id: 1,
    title: "Climate Change and Global Warming",
    description: "Rising global temperatures are causing extreme weather events, sea level rise, and ecosystem disruption.",
    longDescription: "Climate change refers to long-term shifts in temperatures and weather patterns, mainly caused by human activities, especially the burning of fossil fuels. These activities produce heat-trapping gases that wrap around the Earth, preventing heat from escaping into space. The global temperature has already risen by about 1°C above pre-industrial levels, causing significant changes to our planet's systems.",
    severity: 10,
    urgency: 9,
    solvability: 4,
    categories: ["Environment", "Global", "Energy"],
    domain: "world",
    rank: 1,
    impact: "Rising temperatures are causing more frequent and intense heat waves, droughts, floods, and storms. Sea levels are rising, threatening coastal communities. Ecosystems are changing, forcing species to migrate or face extinction. Agriculture is being disrupted, threatening food security for millions. Climate refugees are increasing as regions become uninhabitable.",
    challenges: "Transitioning from fossil fuels to renewable energy requires massive investment and policy changes. International cooperation is difficult to achieve. Economic interests often oppose climate action. Carbon removal technology is still underdeveloped. There's a narrow window to prevent catastrophic warming beyond 1.5°C.",
    potentialSolutions: "Rapid transition to renewable energy sources. Carbon pricing to make polluters pay for emissions. Improved energy efficiency in buildings, transport, and industry. Reforestation and ecosystem restoration. Development of carbon capture technologies. Climate adaptation measures for vulnerable communities.",
    resourceLinks: [
      { title: "IPCC Sixth Assessment Report", url: "https://www.ipcc.ch/assessment-report/ar6/" },
      { title: "NASA Climate Change Evidence", url: "https://climate.nasa.gov/evidence/" },
      { title: "UN Sustainable Development Goal 13", url: "https://sdgs.un.org/goals/goal13" }
    ]
  },
  {
    id: 2,
    title: "Wealth Inequality",
    description: "The growing gap between rich and poor threatens social stability and economic opportunity.",
    longDescription: "Wealth inequality refers to the uneven distribution of assets among residents of a society. It includes the values of homes, automobiles, personal valuables, businesses, savings, and investments. The wealth gap has been widening rapidly, with the richest 1% now owning nearly half of the world's wealth while billions live in poverty.",
    severity: 8,
    urgency: 7,
    solvability: 5,
    categories: ["Economics", "Social", "Global"],
    domain: "world",
    rank: 2,
    impact: "Reduced social mobility and opportunity for those born into poverty. Increased social tensions and political polarization. Unequal access to education, healthcare, and housing. Democratic institutions undermined by the outsized influence of wealth. Inefficient allocation of human capital as talent goes undeveloped.",
    challenges: "Tax avoidance by wealthy individuals and corporations. Political influence of economic elites resisting reforms. Globalization making it difficult to tax mobile capital. Technological change disproportionately benefiting skilled workers. Financialization of the economy increasing returns to capital versus labor.",
    potentialSolutions: "Progressive taxation systems that effectively tax wealth and high incomes. Investment in public services like education, healthcare, and infrastructure. Labor market reforms to strengthen worker bargaining power. Universal basic income or similar programs. Closing tax havens and loopholes. Antitrust enforcement to reduce market concentration.",
    resourceLinks: [
      { title: "World Inequality Database", url: "https://wid.world/" },
      { title: "Oxfam Inequality Reports", url: "https://www.oxfam.org/en/research/inequality-kills" },
      { title: "UN Sustainable Development Goal 10", url: "https://sdgs.un.org/goals/goal10" }
    ]
  },
  
  // Add more world problems (would continue up to 100)
  {
    id: 3,
    title: "Global Food Security",
    description: "Ensuring adequate nutrition for a growing world population while resources become constrained.",
    severity: 9,
    urgency: 8,
    solvability: 6,
    categories: ["Food", "Global", "Health", "Agriculture"],
    domain: "world",
    rank: 3
  },
  {
    id: 4,
    title: "Nuclear Weapons Proliferation",
    description: "The spread of nuclear weapons technology increasing the risk of catastrophic conflict.",
    severity: 9,
    urgency: 7,
    solvability: 5,
    categories: ["Security", "Global", "Politics"],
    domain: "world",
    rank: 4
  },
  {
    id: 5,
    title: "Biodiversity Loss",
    description: "Accelerating extinction of plant and animal species threatening ecosystem stability.",
    severity: 8,
    urgency: 8,
    solvability: 6,
    categories: ["Environment", "Ecology", "Conservation"],
    domain: "world",
    rank: 5
  },
  
  // Add more world problems, simulating a larger dataset
  // We'd add up to 100 for each domain, but I'm including just enough to demonstrate
  
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
  },

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
  },

  // ENVIRONMENT DOMAIN - TOP PROBLEMS
  {
    id: 301,
    title: "Plastic Pollution",
    description: "Accumulation of plastic waste contaminating oceans, soil, and threatening wildlife.",
    longDescription: "Plastic pollution is the accumulation of plastic objects and particles in the Earth's environment that adversely affects wildlife, wildlife habitat, and humans. Approximately 380 million tons of plastic are produced worldwide each year, with about 8 million tons entering the oceans. Once there, plastic breaks down into microplastics that can enter the food chain.",
    severity: 8,
    urgency: 8,
    solvability: 7,
    categories: ["Environment", "Pollution", "Oceans", "Waste"],
    domain: "environment",
    rank: 1,
    impact: "Marine life entanglement and ingestion of plastic debris. Microplastics entering food chains and human bodies with unknown health effects. Toxins leaching from plastics into soil and water. Clogging of waterways and drainage systems. Aesthetic degradation of natural environments. Economic costs to fishing, tourism, and waste management.",
    challenges: "Single-use plastics remain economically efficient and convenient. Developing countries often lack waste management infrastructure. Microplastics are difficult to remove once in the environment. Plastic production continues to increase. Many alternatives to plastic have their own environmental impacts.",
    potentialSolutions: "Comprehensive reduce, reuse, recycle systems. Extended producer responsibility policies. Bans or taxes on single-use plastics. Development of truly biodegradable alternatives. Improved waste collection infrastructure in developing countries. Beach and ocean cleanup initiatives. Consumer education campaigns. Development of plastic-eating enzymes and bacteria.",
    resourceLinks: [
      { title: "UN Environment Programme on Plastic Pollution", url: "https://www.unep.org/plastic-pollution" },
      { title: "The Ocean Cleanup", url: "https://theoceancleanup.com/" },
      { title: "Plastic Pollution Coalition", url: "https://www.plasticpollutioncoalition.org/" }
    ]
  },
  {
    id: 302,
    title: "Deforestation",
    description: "Rapid loss of forests threatening biodiversity and climate stability.",
    severity: 9,
    urgency: 8,
    solvability: 6,
    categories: ["Environment", "Forests", "Biodiversity"],
    domain: "environment",
    rank: 2
  },
  {
    id: 303,
    title: "Ocean Acidification",
    description: "Increasing acidity of oceans due to carbon dioxide absorption damaging marine ecosystems.",
    severity: 8,
    urgency: 7,
    solvability: 5,
    categories: ["Environment", "Oceans", "Climate"],
    domain: "environment",
    rank: 3
  },
  {
    id: 304,
    title: "Water Scarcity",
    description: "Growing shortage of freshwater resources affecting billions of people worldwide.",
    severity: 9,
    urgency: 8,
    solvability: 6,
    categories: ["Environment", "Water", "Resources"],
    domain: "environment",
    rank: 4
  },
  {
    id: 305,
    title: "Air Pollution",
    description: "Contamination of air with harmful substances causing health problems and environmental damage.",
    severity: 8,
    urgency: 8,
    solvability: 7,
    categories: ["Environment", "Pollution", "Health"],
    domain: "environment",
    rank: 5
  }
  
  // Additional domains and problems would follow a similar pattern
  // Each domain would have 100 problems ranked from 1-100
  // For brevity, I've shown only 5 problems per domain as examples
];

// Helper function to get problems by domain
export const getProblemsByDomain = (domain: Problem['domain']) => {
  return problemsData.filter(problem => problem.domain === domain).sort((a, b) => (a.rank || 999) - (b.rank || 999));
};

// Helper function to get all available domains
export const getAvailableDomains = (): Problem['domain'][] => {
  const domains = new Set(problemsData.map(problem => problem.domain));
  return Array.from(domains) as Problem['domain'][];
};

// Helper function to get a problem by ID
export const getProblemById = (id: number) => {
  return problemsData.find(problem => problem.id === id);
};
