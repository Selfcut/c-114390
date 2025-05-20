
import { Problem } from './types';

export const technologyProblems: Problem[] = [
  {
    id: 3001,
    title: "AI Alignment",
    description: "Ensuring that advanced AI systems align with human values and goals.",
    longDescription: "As AI systems become more powerful, ensuring they remain aligned with human values, intentions, and ethical considerations becomes increasingly critical. Misaligned AI systems could optimize for objectives that are harmful to humanity or pursue goals that differ from their designers' intentions.",
    severity: 9,
    urgency: 8,
    solvability: 4,
    categories: ["AI", "Ethics", "Existential Risk"],
    domain: "technology",
    impact: "Could determine humanity's future as AI capabilities advance beyond human comprehension.",
    challenges: "Complex value alignment, reward hacking, specification gaming, distributional shift, and the philosophical challenge of defining human values mathematically.",
    potentialSolutions: "Technical approaches include cooperative inverse reinforcement learning, debate-based learning, constitutional AI approaches, interpretability research, and extensive testing across diverse scenarios.",
    resourceLinks: [
      { title: "AI Alignment Research Overview", url: "https://www.alignmentforum.org/" },
      { title: "The Alignment Problem", url: "https://brianchristian.org/the-alignment-problem/" }
    ],
    rank: 1
  },
  {
    id: 3002,
    title: "Digital Privacy Erosion",
    description: "The increasing collection and misuse of personal data in the digital age.",
    longDescription: "As technology becomes more pervasive, vast amounts of personal data are being collected, stored, and analyzed. This raises serious concerns about privacy rights, surveillance, data security, and the potential for misuse by corporations and governments.",
    severity: 8,
    urgency: 9,
    solvability: 6,
    categories: ["Privacy", "Data", "Rights"],
    domain: "technology",
    impact: "Affects individual freedom, autonomy, and the foundation of democratic societies.",
    challenges: "Technical complexity, economic incentives favoring data collection, lack of awareness, and jurisdictional differences in regulation.",
    potentialSolutions: "Privacy-preserving technologies, comprehensive data protection legislation, data minimization practices, and increasing public awareness about privacy risks.",
    resourceLinks: [
      { title: "Electronic Frontier Foundation", url: "https://www.eff.org/issues/privacy" },
      { title: "Privacy Tools Guide", url: "https://www.privacytools.io/" }
    ],
    rank: 2
  },
  {
    id: 3003,
    title: "Cybersecurity Vulnerabilities",
    description: "Growing threats to digital infrastructure and sensitive systems.",
    longDescription: "As society becomes increasingly dependent on digital systems, vulnerabilities in these systems pose significant risks to critical infrastructure, financial systems, healthcare, and other essential services. Cyber attacks are becoming more sophisticated while many systems remain inadequately protected.",
    severity: 8,
    urgency: 9,
    solvability: 6,
    categories: ["Security", "Infrastructure", "Digital"],
    domain: "technology",
    impact: "Can disrupt essential services, compromise sensitive data, and cause economic damage.",
    challenges: "Rapidly evolving threats, legacy systems, resource constraints, and human factors.",
    potentialSolutions: "Security by design principles, regular security audits, zero-trust architectures, better encryption standards, and improved cybersecurity education and awareness.",
    resourceLinks: [
      { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" },
      { title: "Open Web Application Security Project", url: "https://owasp.org/" }
    ],
    rank: 3
  },
  {
    id: 3004,
    title: "Digital Misinformation",
    description: "The spread of false information through digital platforms.",
    longDescription: "Digital platforms have enabled the rapid spread of misinformation, disinformation, and propaganda. This threatens informed public discourse, democratic processes, public health decisions, and societal cohesion.",
    severity: 8,
    urgency: 9,
    solvability: 5,
    categories: ["Information", "Media", "Democracy"],
    domain: "technology",
    impact: "Undermines democratic processes, public health, and social cohesion.",
    challenges: "Balance with free speech concerns, cross-platform coordination, detection difficulties, and jurisdictional issues.",
    potentialSolutions: "Media literacy education, improved content moderation systems, transparent algorithms, fact-checking partnerships, and platform design changes that reduce virality of unverified information.",
    resourceLinks: [
      { title: "First Draft News", url: "https://firstdraftnews.org/" },
      { title: "Media Literacy Resources", url: "https://medialiteracyproject.org/" }
    ],
    rank: 4
  },
  {
    id: 3005,
    title: "Digital Divide",
    description: "Unequal access to digital technologies and the internet.",
    longDescription: "The digital divide refers to the gap between those who have access to modern information and communication technology and those who don't. This includes gaps in access to reliable internet, devices, and digital literacy skills. As essential services and opportunities move online, this divide exacerbates existing inequalities.",
    severity: 7,
    urgency: 8,
    solvability: 6,
    categories: ["Equity", "Infrastructure", "Education"],
    domain: "technology",
    impact: "Deepens economic inequality and limits access to education, healthcare, and economic opportunities.",
    challenges: "Infrastructure costs, geographic challenges, economic barriers, and language/literacy barriers.",
    potentialSolutions: "Universal broadband initiatives, low-cost device programs, public access points, digital literacy training, and multilingual content development.",
    resourceLinks: [
      { title: "Alliance for Affordable Internet", url: "https://a4ai.org/" },
      { title: "Digital Divide Council", url: "https://www.digitaldividecouncil.com/" }
    ],
    rank: 5
  },
  {
    id: 3006,
    title: "Algorithmic Bias",
    description: "Discrimination and unfairness in automated decision systems.",
    longDescription: "Algorithmic systems increasingly make or influence decisions affecting people's lives, from loan approvals to hiring and medical diagnoses. When these systems exhibit biases, they can perpetuate and amplify existing social inequities.",
    severity: 7,
    urgency: 8,
    solvability: 6,
    categories: ["AI", "Ethics", "Equity"],
    domain: "technology",
    impact: "Perpetuates and potentially amplifies societal biases and discrimination.",
    challenges: "Data bias, proxy discrimination, lack of diversity in development teams, and opaque algorithms.",
    potentialSolutions: "Algorithmic impact assessments, diverse and representative datasets, algorithmic fairness techniques, transparent AI development, and regulatory standards for high-stake decision systems.",
    resourceLinks: [
      { title: "Algorithmic Justice League", url: "https://www.ajl.org/" },
      { title: "AI Fairness 360", url: "https://aif360.mybluemix.net/" }
    ],
    rank: 6
  },
  {
    id: 3007,
    title: "E-Waste Management",
    description: "Growing toxic electronic waste from rapid tech consumption.",
    longDescription: "The rapid pace of technological innovation, coupled with decreasing product lifespans, has led to growing volumes of electronic waste. This e-waste contains hazardous materials that can harm the environment and human health when improperly disposed of, while also wasting valuable resources.",
    severity: 7,
    urgency: 7,
    solvability: 7,
    categories: ["Waste", "Environment", "Resources"],
    domain: "technology",
    impact: "Environmental pollution, health risks, and resource depletion.",
    challenges: "Complex material composition, economic incentives for disposability, lack of recycling infrastructure, and global waste trafficking.",
    potentialSolutions: "Extended producer responsibility policies, design for repairability and recyclability, formal e-waste recycling systems, and consumer education about proper disposal.",
    resourceLinks: [
      { title: "Basel Action Network", url: "https://www.ban.org/" },
      { title: "iFixit Repair Guides", url: "https://www.ifixit.com/" }
    ],
    rank: 7
  },
  {
    id: 3008,
    title: "Automation and Future of Work",
    description: "Job displacement due to increasing automation and AI.",
    longDescription: "Advances in robotics, AI, and automation are transforming the nature of work, potentially displacing jobs across various sectors. This trend raises questions about economic security, purpose, inequality, and how to prepare for a future with different labor needs.",
    severity: 8,
    urgency: 7,
    solvability: 5,
    categories: ["Economy", "Labor", "AI"],
    domain: "technology",
    impact: "Could fundamentally reshape employment patterns, economic systems, and social contracts.",
    challenges: "Pace of technological change, skills mismatch, economic inequality, and outdated social safety systems.",
    potentialSolutions: "Investment in education and retraining programs, exploration of new economic models including UBI, policies to promote human-complementary automation, and stronger social safety nets.",
    resourceLinks: [
      { title: "Future of Work Commission", url: "https://www.ilo.org/global/topics/future-of-work/lang--en/index.htm" },
      { title: "MIT Task Force on Work of the Future", url: "https://workofthefuture.mit.edu/" }
    ],
    rank: 8
  },
  {
    id: 3009,
    title: "Technology Addiction",
    description: "Excessive and compulsive use of digital devices and services.",
    longDescription: "Many digital products are designed to maximize engagement through psychological techniques that can foster addictive usage patterns. This raises concerns about the impact on mental health, productivity, relationships, and overall quality of life.",
    severity: 6,
    urgency: 7,
    solvability: 6,
    categories: ["Health", "Psychology", "Design"],
    domain: "technology",
    impact: "Affects mental health, productivity, relationships, and well-being on a broad scale.",
    challenges: "Business models that incentivize maximizing engagement, limited research, individual vulnerability differences, and technological integration in daily life.",
    potentialSolutions: "Ethical design standards, digital wellness features, education about healthy technology use, modified business models that don't rely on maximizing attention, and research on technology's psychological impacts.",
    resourceLinks: [
      { title: "Center for Humane Technology", url: "https://www.humanetech.com/" },
      { title: "Digital Wellness Collective", url: "https://www.digitalwellnesscollective.org/" }
    ],
    rank: 9
  },
  {
    id: 3010,
    title: "Network Security Vulnerabilities",
    description: "Risks to critical network infrastructure and connected systems.",
    longDescription: "As systems become increasingly interconnected, vulnerabilities in network security pose significant threats. These vulnerabilities can be exploited for data theft, system disruption, or unauthorized access to sensitive systems.",
    severity: 8,
    urgency: 8,
    solvability: 7,
    categories: ["Security", "Networks", "Infrastructure"],
    domain: "technology",
    impact: "Threatens critical infrastructure, privacy, and digital economy safety.",
    challenges: "Growing attack surface, legacy systems, zero-day vulnerabilities, and sophisticated threat actors.",
    potentialSolutions: "Regular security audits, network segmentation, zero-trust architecture, improved encryption standards, and security-focused system design.",
    resourceLinks: [
      { title: "CISA Cybersecurity Resources", url: "https://www.cisa.gov/cybersecurity" },
      { title: "Network Security Best Practices", url: "https://www.sans.org/security-resources/" }
    ],
    rank: 10
  }
];
