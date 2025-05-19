
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
}

// The first 10 world problems (out of 100)
export const problemsData: Problem[] = [
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
    impact: "Reduced social mobility and opportunity for those born into poverty. Increased social tensions and political polarization. Unequal access to education, healthcare, and housing. Democratic institutions undermined by the outsized influence of wealth. Inefficient allocation of human capital as talent goes undeveloped.",
    challenges: "Tax avoidance by wealthy individuals and corporations. Political influence of economic elites resisting reforms. Globalization making it difficult to tax mobile capital. Technological change disproportionately benefiting skilled workers. Financialization of the economy increasing returns to capital versus labor.",
    potentialSolutions: "Progressive taxation systems that effectively tax wealth and high incomes. Investment in public services like education, healthcare, and infrastructure. Labor market reforms to strengthen worker bargaining power. Universal basic income or similar programs. Closing tax havens and loopholes. Antitrust enforcement to reduce market concentration.",
    resourceLinks: [
      { title: "World Inequality Database", url: "https://wid.world/" },
      { title: "Oxfam Inequality Reports", url: "https://www.oxfam.org/en/research/inequality-kills" },
      { title: "UN Sustainable Development Goal 10", url: "https://sdgs.un.org/goals/goal10" }
    ]
  },
  {
    id: 3,
    title: "Global Food Security",
    description: "Ensuring adequate nutrition for a growing world population while resources become constrained.",
    longDescription: "Food security exists when all people, at all times, have physical, social, and economic access to sufficient, safe, and nutritious food. Despite producing enough food globally to feed everyone, nearly 690 million people go hungry. Climate change, water scarcity, soil degradation, and conflict are increasingly threatening food production systems.",
    severity: 9,
    urgency: 8,
    solvability: 6,
    categories: ["Food", "Global", "Health", "Agriculture"],
    domain: "world",
    impact: "Malnutrition affecting physical and cognitive development, especially in children. Reduced productivity and economic development in food-insecure regions. Political instability and conflict driven by food shortages. Forced migration as farming becomes untenable in some regions. Environmental degradation as desperate communities overexploit natural resources.",
    challenges: "Climate change threatening crop yields and reliability. Water scarcity affecting irrigation capacity. Soil degradation reducing agricultural productivity. Food waste throughout supply chains. Conflict disrupting food systems. Population growth increasing demand. Economic inequality limiting access to food.",
    potentialSolutions: "Climate-smart agriculture practices. Improved irrigation efficiency and water management. Reduction of food waste through better storage, transport, and consumer education. Development of drought and pest-resistant crops. Strengthening local food systems and smallholder farmers. Policies ensuring equitable food access. Transitioning to more sustainable diets.",
    resourceLinks: [
      { title: "UN Food and Agriculture Organization", url: "https://www.fao.org/food-security/" },
      { title: "World Food Programme", url: "https://www.wfp.org/" },
      { title: "Global Food Security Index", url: "https://impact.economist.com/sustainability/project/food-security-index/" }
    ]
  },
  {
    id: 4,
    title: "Antibiotic Resistance",
    description: "The growing ineffectiveness of antibiotics threatens to undermine modern medicine.",
    longDescription: "Antibiotic resistance occurs when bacteria evolve to survive treatment with antibiotics that once killed them. This natural process is accelerated by overuse and misuse of antibiotics in humans and animals. Without effective antibiotics, many common infections could become deadly again, and procedures like surgery or chemotherapy would carry much higher risks.",
    severity: 9,
    urgency: 7,
    solvability: 5,
    categories: ["Health", "Science", "Medicine"],
    domain: "health",
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
    id: 5,
    title: "AI Alignment",
    description: "Ensuring that advanced AI systems remain safe, beneficial, and aligned with human values.",
    longDescription: "AI alignment refers to the challenge of ensuring that artificial intelligence systems act in accordance with human intentions and values, even as they become increasingly capable and autonomous. As AI systems become more powerful, the risk increases that they might optimize for objectives that don't fully capture what humans care about, potentially leading to harmful outcomes.",
    severity: 9,
    urgency: 7,
    solvability: 3,
    categories: ["Technology", "Ethics", "Future"],
    domain: "technology",
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
    id: 6,
    title: "Plastic Pollution",
    description: "Rapidly accumulating plastic waste is contaminating oceans and threatening ecosystems.",
    longDescription: "Plastic pollution is the accumulation of plastic objects and particles in the Earth's environment that adversely affects wildlife, wildlife habitat, and humans. Approximately 380 million tons of plastic are produced worldwide each year, with about 8 million tons entering the oceans. Once there, plastic breaks down into microplastics that can enter the food chain.",
    severity: 8,
    urgency: 8,
    solvability: 7,
    categories: ["Environment", "Pollution", "Oceans", "Waste"],
    domain: "environment",
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
    id: 7,
    title: "Access to Clean Water",
    description: "Many communities worldwide lack access to safe drinking water and sanitation.",
    longDescription: "Access to clean water means having a reliable source of potable water within a reasonable distance from one's dwelling. Despite progress, 785 million people still lack access to basic drinking water services, and 2 billion people lack safely managed drinking water. Water scarcity affects more than 40% of the global population and is projected to rise with climate change.",
    severity: 9,
    urgency: 9,
    solvability: 6,
    categories: ["Health", "Infrastructure", "Basic Needs", "Environment"],
    domain: "world",
    impact: "Waterborne diseases causing illness and death, especially among children. Hours spent collecting water reducing educational and economic opportunities, particularly for women and girls. Inadequate sanitation contaminating water sources and spreading disease. Water stress fueling conflict between communities and nations. Agricultural productivity limited by water scarcity.",
    challenges: "Climate change altering precipitation patterns and exacerbating water scarcity. Growing population increasing demand for limited water resources. Groundwater depletion from over-extraction. Water pollution from agriculture, industry, and inadequate sanitation. Aging water infrastructure in many regions. Water rights disputes crossing national boundaries.",
    potentialSolutions: "Investment in water supply and sanitation infrastructure. Water conservation and efficiency measures. Watershed protection and management. Rainwater harvesting and storage systems. Water recycling and reuse technologies. Desalination in coastal areas with renewable energy. Equitable water governance and rights frameworks. Appropriate pricing of water while ensuring basic access for all.",
    resourceLinks: [
      { title: "UN Sustainable Development Goal 6", url: "https://sdgs.un.org/goals/goal6" },
      { title: "WHO/UNICEF Joint Monitoring Programme", url: "https://washdata.org/" },
      { title: "Water.org", url: "https://water.org/" }
    ]
  },
  {
    id: 8,
    title: "Biodiversity Loss",
    description: "Rapid extinction of plant and animal species threatens ecosystem stability.",
    longDescription: "Biodiversity loss refers to the reduction of variety in genes, species, or ecosystems in a given area or on Earth generally. The current extinction rate is estimated to be 100 to 1,000 times higher than natural background rates, constituting the sixth mass extinction in Earth's history. Unlike previous mass extinctions, this one is primarily caused by human activities.",
    severity: 9,
    urgency: 8,
    solvability: 5,
    categories: ["Environment", "Ecology", "Wildlife"],
    domain: "environment",
    impact: "Disruption of ecosystem services like pollination, water purification, and carbon sequestration. Loss of potential medicines and other valuable biological resources. Reduced resilience of ecosystems to environmental changes and stresses. Collapse of food webs affecting agriculture and fisheries. Cultural and spiritual losses as species with significant meaning disappear.",
    challenges: "Habitat destruction continues as human populations and consumption grow. Climate change forcing species to adapt or migrate faster than many can. Invasive species disrupting ecosystems. Pollution affecting reproductive health of many species. Overexploitation through hunting, fishing, and timber harvesting. Limited understanding of many species' roles in ecosystems.",
    potentialSolutions: "Expanding and strengthening protected areas on land and sea. Restoration of degraded ecosystems and wildlife corridors. Sustainable management of agriculture, forestry, and fisheries. Reducing pollution, especially from plastics and agricultural chemicals. Addressing climate change to reduce thermal stress on ecosystems. Conservation breeding programs for critically endangered species. Economic incentives for biodiversity conservation.",
    resourceLinks: [
      { title: "UN Convention on Biological Diversity", url: "https://www.cbd.int/" },
      { title: "IUCN Red List of Threatened Species", url: "https://www.iucnredlist.org/" },
      { title: "World Wildlife Fund", url: "https://www.worldwildlife.org/" }
    ]
  },
  {
    id: 9,
    title: "Digital Privacy",
    description: "Balancing technological advancement with protection of personal data and privacy rights.",
    longDescription: "Digital privacy concerns the right of individuals to control how their personal information is collected and used online. The increasing digitization of society has led to unprecedented collection and use of personal data by both governments and private companies. This raises fundamental questions about surveillance, consent, data ownership, and the boundaries of privacy in the digital age.",
    severity: 7,
    urgency: 8,
    solvability: 6,
    categories: ["Technology", "Rights", "Governance", "Data"],
    domain: "technology",
    impact: "Chilling effects on free speech and association due to surveillance concerns. Identity theft and fraud through data breaches. Manipulation of opinions and behavior through microtargeted advertising. Discrimination through algorithmic profiling. Erosion of personal autonomy as data collection becomes ubiquitous. Loss of control over one's digital identity and reputation.",
    challenges: "Business models of major tech companies rely on extensive data collection. Security agencies advocate for access to data for law enforcement and intelligence. Technical complexity makes privacy implications difficult for average users to understand. International nature of data flows complicates regulatory approaches. Convenience often trades off against privacy in digital services.",
    potentialSolutions: "Comprehensive privacy legislation with meaningful enforcement. Privacy by design in technology development. Improved transparency about data collection and use. Tools that give users more control over their data. Business models that don't rely on surveillance. Digital literacy education about privacy risks and protections. International cooperation on privacy standards.",
    resourceLinks: [
      { title: "Electronic Frontier Foundation", url: "https://www.eff.org/issues/privacy" },
      { title: "EU General Data Protection Regulation", url: "https://gdpr.eu/" },
      { title: "Privacy International", url: "https://privacyinternational.org/" }
    ]
  },
  {
    id: 10,
    title: "Pandemic Preparedness",
    description: "Building global systems to detect, prevent, and respond to future pandemics.",
    longDescription: "Pandemic preparedness involves developing systems, policies, and infrastructure to prevent, detect, and respond to disease outbreaks with pandemic potential. The COVID-19 pandemic revealed critical gaps in global health security, highlighting the need for stronger international cooperation, surveillance systems, and response capabilities to prevent future pandemics from causing similar or worse devastation.",
    severity: 9,
    urgency: 8,
    solvability: 7,
    categories: ["Health", "Global", "Governance", "Security"],
    domain: "health",
    impact: "COVID-19 caused millions of deaths, unprecedented economic disruption, educational setbacks, and mental health challenges globally. Future pandemics could potentially be more transmissible or lethal. Health systems can be overwhelmed during outbreaks, affecting care for all conditions. Inequitable impacts exacerbate existing social and economic disparities.",
    challenges: "Political and economic barriers to international cooperation. Funding for preparedness often cut during non-crisis periods. Surveillance gaps, particularly in regions with limited health infrastructure. Misinformation undermining public health responses. Antimicrobial resistance limiting treatment options. Urbanization and travel increasing transmission risks.",
    potentialSolutions: "Strengthened disease surveillance and early warning systems. Increased manufacturing capacity for vaccines, diagnostics, and PPE. Pre-negotiated response protocols and supply chain agreements. Sustained funding for health emergency preparedness. Improved global governance for health emergencies. One Health approach addressing connections between human, animal, and environmental health. Research into broadly protective vaccines and antivirals.",
    resourceLinks: [
      { title: "WHO Pandemic Preparedness", url: "https://www.who.int/emergencies/preparedness/en/" },
      { title: "Global Health Security Index", url: "https://www.ghsindex.org/" },
      { title: "Coalition for Epidemic Preparedness Innovations", url: "https://cepi.net/" }
    ]
  }
];

// Helper function to get problems by domain
export const getProblemsByDomain = (domain: Problem['domain']) => {
  return problemsData.filter(problem => problem.domain === domain);
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

