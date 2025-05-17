
export interface Problem {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  severity: number; // 1-10 scale, 10 being most severe
  urgency: number; // 1-10 scale, 10 being most urgent
  solvability: number; // 1-10 scale, 10 being most solvable
  categories: string[];
  discussions: number;
  solutions: number;
}

// List of 100 global problems
export const problemsData: Problem[] = [
  {
    id: 1,
    title: "Climate Change",
    description: "Global warming and its effects on ecosystems and human societies.",
    longDescription: "Climate change involves global warming driven by human-induced emissions of greenhouse gases. This leads to large-scale shifts in weather patterns with widespread effects on human societies and ecosystems. Rising global temperatures lead to sea level rise, melting ice sheets, and extreme weather events. The Paris Agreement aims to limit warming to well below 2°C, but global cooperation and drastic emissions reductions are needed.",
    severity: 9,
    urgency: 10,
    solvability: 5,
    categories: ["Environmental", "Global", "Long-term"],
    discussions: 124,
    solutions: 37
  },
  {
    id: 2,
    title: "Mass Species Extinction",
    description: "Rapid loss of biodiversity and ecosystem collapse.",
    longDescription: "Earth is experiencing its sixth major extinction event, with species disappearing at 100-1000 times the natural background rate. This mass extinction is primarily driven by habitat destruction, pollution, climate change, and exploitation of species. The loss of biodiversity threatens ecosystem services essential for human survival, including clean air and water, pollination, and food production.",
    severity: 9,
    urgency: 9,
    solvability: 6,
    categories: ["Environmental", "Biodiversity", "Ecosystem"],
    discussions: 83,
    solutions: 29
  },
  {
    id: 3,
    title: "Global Pandemic Risks",
    description: "Prevention and preparation for future pandemics.",
    longDescription: "The COVID-19 pandemic demonstrated global vulnerability to infectious disease outbreaks. Factors increasing pandemic risks include habitat encroachment, global travel, urbanization, and antimicrobial resistance. Future pandemics could potentially be even more transmissible and lethal. Improved surveillance systems, vaccine platforms, international cooperation, and healthcare infrastructure are essential to mitigate future pandemic threats.",
    severity: 8,
    urgency: 8,
    solvability: 7,
    categories: ["Health", "Global", "Disaster"],
    discussions: 97,
    solutions: 42
  },
  {
    id: 4,
    title: "Nuclear Weapons Proliferation",
    description: "Risk of nuclear war and weapons proliferation.",
    longDescription: "Nuclear weapons pose an existential threat to humanity. There are approximately 13,000 nuclear weapons in the world today, with enough destructive power to end civilization as we know it. The risk of nuclear conflict through escalation, miscalculation, or terrorism remains significant. International disarmament efforts and non-proliferation treaties are crucial but face significant geopolitical challenges.",
    severity: 10,
    urgency: 7,
    solvability: 4,
    categories: ["Security", "Global", "Existential"],
    discussions: 56,
    solutions: 18
  },
  {
    id: 5,
    title: "AI Safety and Alignment",
    description: "Ensuring advanced AI systems remain beneficial and aligned with human values.",
    longDescription: "As artificial intelligence systems become more capable, ensuring they remain safe and aligned with human values becomes crucial. Advanced AI could potentially surpass human intelligence in many domains, leading to difficult-to-predict outcomes. Technical challenges include value alignment, interpretability, robustness, and corrigibility. Governance frameworks and international cooperation are needed to prevent misuse and ensure benefits are widely shared.",
    severity: 8,
    urgency: 8,
    solvability: 6,
    categories: ["Technology", "Existential", "Governance"],
    discussions: 89,
    solutions: 31
  },
  {
    id: 6,
    title: "Global Poverty",
    description: "Extreme poverty affecting billions worldwide.",
    longDescription: "Although extreme poverty has declined significantly in recent decades, hundreds of millions still live on less than $1.90 per day. Poverty causes malnutrition, lack of access to education and healthcare, and vulnerability to exploitation. Economic development, improved governance, effective aid, and targeted interventions in health and education can help address this challenge.",
    severity: 8,
    urgency: 9,
    solvability: 7,
    categories: ["Economic", "Social", "Development"],
    discussions: 112,
    solutions: 47
  },
  {
    id: 7,
    title: "Water Scarcity",
    description: "Growing shortage of clean, accessible freshwater.",
    longDescription: "Two-thirds of the global population experience water scarcity at least one month per year. Climate change, population growth, and inefficient water use exacerbate this problem. Water scarcity threatens food production, ecosystem health, and can lead to conflicts. Solutions include improved water management, technology for water purification and conservation, and international water-sharing agreements.",
    severity: 8,
    urgency: 8,
    solvability: 6,
    categories: ["Environmental", "Resource", "Development"],
    discussions: 76,
    solutions: 33
  },
  {
    id: 8,
    title: "Antibiotic Resistance",
    description: "Increasing bacterial resistance to antibiotics.",
    longDescription: "Antimicrobial resistance threatens to return us to an era where common infections could be fatal. Overuse of antibiotics in healthcare and agriculture accelerates the evolution of resistant bacteria. Without effective action, drug-resistant infections could kill 10 million people annually by 2050. Solutions include new antibiotic development, reduced antibiotic use, improved infection control, and alternative treatment approaches.",
    severity: 7,
    urgency: 8,
    solvability: 6,
    categories: ["Health", "Science", "Medical"],
    discussions: 63,
    solutions: 28
  },
  {
    id: 9,
    title: "Food Security",
    description: "Ensuring stable access to nutritious food globally.",
    longDescription: "Despite global food production being theoretically sufficient, hundreds of millions face hunger and malnutrition due to poverty, conflict, and distribution problems. Climate change threatens agricultural productivity in many regions. Sustainable agricultural practices, reduced food waste, improved distribution systems, and economic development are key to addressing food insecurity.",
    severity: 8,
    urgency: 9,
    solvability: 7,
    categories: ["Food", "Development", "Resource"],
    discussions: 94,
    solutions: 39
  },
  {
    id: 10,
    title: "Ocean Acidification",
    description: "Decreasing pH of oceans due to absorbed carbon dioxide.",
    longDescription: "As oceans absorb atmospheric carbon dioxide, seawater becomes more acidic. This threatens marine organisms with calcium carbonate shells or skeletons, including corals, mollusks, and many plankton species. This disrupts marine food webs and ecosystems. Ocean acidification is directly linked to carbon emissions, so mitigation requires the same strategies as addressing climate change.",
    severity: 7,
    urgency: 7,
    solvability: 5,
    categories: ["Environmental", "Marine", "Climate"],
    discussions: 57,
    solutions: 21
  },
  // Additional problems 11-100
  {
    id: 11,
    title: "Deforestation",
    description: "Rapid loss of forests worldwide, particularly in tropical regions.",
    longDescription: "Forests cover about 31% of the world's land area, but are disappearing at an alarming rate due to agriculture, logging, and development. Deforestation contributes to climate change, biodiversity loss, and disrupts the water cycle. Sustainable forestry practices, protected areas, and addressing the economic drivers of deforestation are essential solutions.",
    severity: 8,
    urgency: 8,
    solvability: 7,
    categories: ["Environmental", "Biodiversity", "Climate"],
    discussions: 81,
    solutions: 34
  },
  {
    id: 12,
    title: "Economic Inequality",
    description: "Growing wealth and income disparities within and between nations.",
    longDescription: "Economic inequality has increased in many countries over recent decades. Extreme inequality undermines social cohesion, economic growth, and democratic governance. Contributing factors include technological change, globalization, tax policy, and weakened labor protections. Solutions involve progressive taxation, education investment, labor protections, and addressing tax avoidance.",
    severity: 7,
    urgency: 7,
    solvability: 6,
    categories: ["Economic", "Social", "Governance"],
    discussions: 103,
    solutions: 41
  },
  {
    id: 13,
    title: "Plastic Pollution",
    description: "Accumulation of plastic waste in the environment, especially oceans.",
    longDescription: "Over 300 million tons of plastic are produced annually, much of which ends up as waste in the environment. Plastic pollution threatens wildlife, contaminates food chains, and degrades into microplastics that may have wide-ranging health impacts. Solutions include reducing plastic production, improving waste management, developing alternatives, and changing consumer behavior.",
    severity: 7,
    urgency: 8,
    solvability: 8,
    categories: ["Environmental", "Pollution", "Waste"],
    discussions: 92,
    solutions: 47
  },
  // Continue with remaining problems
  {
    id: 14,
    title: "Air Pollution",
    description: "Harmful particulates and gases contaminating the air we breathe.",
    longDescription: "Air pollution causes 7 million premature deaths annually, primarily from particulate matter, nitrogen dioxide, sulfur dioxide, and ozone. Major sources include fossil fuel combustion, industrial processes, and agriculture. Solutions include clean energy transition, emissions regulations, improved public transportation, and urban planning.",
    severity: 8,
    urgency: 9,
    solvability: 7,
    categories: ["Environmental", "Health", "Urban"],
    discussions: 78,
    solutions: 36
  },
  {
    id: 15,
    title: "Agricultural Land Degradation",
    description: "Soil erosion and degradation threatening food production.",
    longDescription: "About one-third of the world's agricultural land is moderately to highly degraded due to erosion, salinization, compaction, and nutrient depletion. This threatens long-term food security as regenerating soil can take centuries. Sustainable agricultural practices, including reduced tillage, cover crops, and agroforestry, are key to addressing this problem.",
    severity: 7,
    urgency: 7,
    solvability: 7,
    categories: ["Food", "Environmental", "Agriculture"],
    discussions: 61,
    solutions: 32
  },
  {
    id: 16,
    title: "Mental Health Crisis",
    description: "Rising mental health disorders globally with inadequate treatment.",
    longDescription: "Mental health disorders affect hundreds of millions worldwide, with depression alone affecting 264 million people. Most receive inadequate treatment due to stigma and lack of resources. The economic cost exceeds $1 trillion annually in lost productivity. Solutions include improved access to care, reducing stigma, early intervention, and addressing social determinants of mental health.",
    severity: 7,
    urgency: 8,
    solvability: 7,
    categories: ["Health", "Social", "Development"],
    discussions: 84,
    solutions: 39
  },
  {
    id: 17,
    title: "Education Access Gap",
    description: "Inequitable access to quality education worldwide.",
    longDescription: "Over 260 million children lack access to education, and many more receive poor quality education. This perpetuates cycles of poverty and limits human potential. Barriers include poverty, gender discrimination, conflict, and poor governance. Solutions involve increased education funding, teacher training, addressing gender barriers, and leveraging technology for remote learning.",
    severity: 7,
    urgency: 7,
    solvability: 8,
    categories: ["Education", "Development", "Social"],
    discussions: 72,
    solutions: 43
  },
  {
    id: 18,
    title: "Cybersecurity Threats",
    description: "Growing risks of cyberattacks on critical infrastructure.",
    longDescription: "As society becomes increasingly digitized, the risk of devastating cyberattacks grows. Threats include attacks on power grids, water systems, hospitals, and financial networks. State and non-state actors continue to develop advanced cyber weapons. Solutions require improved security practices, international cooperation, resilient systems design, and addressing the cybersecurity skills shortage.",
    severity: 7,
    urgency: 8,
    solvability: 6,
    categories: ["Technology", "Security", "Governance"],
    discussions: 69,
    solutions: 31
  },
  {
    id: 19,
    title: "Demographic Challenges",
    description: "Aging populations in developed nations and youth bulges elsewhere.",
    longDescription: "Many developed nations face unprecedented population aging, straining pension systems and healthcare. Meanwhile, developing regions with youth bulges struggle to generate sufficient employment. Both trends create economic and social challenges. Solutions involve sustainable pension reform, healthcare innovation, youth employment initiatives, and humane immigration policies.",
    severity: 6,
    urgency: 6,
    solvability: 6,
    categories: ["Demographic", "Economic", "Social"],
    discussions: 51,
    solutions: 27
  },
  {
    id: 20,
    title: "Refugee Crisis",
    description: "Record numbers of displaced people fleeing conflict and persecution.",
    longDescription: "Over 80 million people are forcibly displaced worldwide, including 26 million refugees. Conflict, persecution, and climate change drive this crisis. Refugees often face dangerous journeys, inadequate shelter, and limited rights. Solutions require addressing root causes of displacement, improved international protection frameworks, equitable responsibility-sharing, and integration support.",
    severity: 8,
    urgency: 9,
    solvability: 5,
    categories: ["Humanitarian", "Governance", "Social"],
    discussions: 87,
    solutions: 33
  },
  // Additional problems to reach 100 (truncated for brevity)
  // In a real implementation, all 100 problems would be fully detailed
  {
    id: 21,
    title: "Groundwater Depletion",
    description: "Unsustainable extraction of groundwater resources.",
    longDescription: "Groundwater aquifers are being depleted at alarming rates in many regions, threatening water security and food production. Once depleted, many aquifers take thousands of years to recharge. Causes include inefficient irrigation, growing populations, and inadequate regulation. Solutions include improved water management, precision irrigation, appropriate pricing, and managed aquifer recharge.",
    severity: 7,
    urgency: 7,
    solvability: 6,
    categories: ["Water", "Resource", "Agriculture"],
    discussions: 46,
    solutions: 24
  },
  {
    id: 22,
    title: "Bioterrorism",
    description: "Potential use of biological agents as weapons.",
    longDescription: "Advances in biotechnology lower barriers to creating dangerous pathogens, increasing bioterrorism risks. A deliberately engineered pandemic could potentially be more deadly than naturally occurring diseases. Solutions include strengthened biosecurity measures, international agreements, enhanced detection capabilities, and responsible research governance.",
    severity: 9,
    urgency: 7,
    solvability: 5,
    categories: ["Security", "Health", "Existential"],
    discussions: 38,
    solutions: 15
  },
  {
    id: 23,
    title: "Overfishing",
    description: "Depletion of fish stocks threatening marine ecosystems and food security.",
    longDescription: "About 33% of global fish stocks are overfished, threatening marine biodiversity and the livelihoods of hundreds of millions of people. Causes include illegal fishing, overcapacity, and poor management. Solutions include sustainable fishing quotas, marine protected areas, reduced subsidies, and improved monitoring of fishing activities.",
    severity: 7,
    urgency: 7,
    solvability: 7,
    categories: ["Marine", "Food", "Environmental"],
    discussions: 59,
    solutions: 31
  },
  {
    id: 24,
    title: "Corporate Influence on Politics",
    description: "Outsized corporate power in governmental decision-making.",
    longDescription: "In many countries, corporate interests exert significant influence over political processes through lobbying, campaign financing, and regulatory capture. This undermines democratic principles and can lead to policies that favor corporate profits over public welfare. Solutions include campaign finance reform, lobbying restrictions, transparent governance, and stronger anti-corruption measures.",
    severity: 7,
    urgency: 7,
    solvability: 5,
    categories: ["Governance", "Economic", "Political"],
    discussions: 74,
    solutions: 29
  },
  {
    id: 25,
    title: "Weaponization of Space",
    description: "Growing militarization of outer space.",
    longDescription: "As nations develop anti-satellite weapons and space-based military capabilities, the risk of conflict extending into space increases. Such conflict could destroy satellite infrastructure critical for communication, navigation, and monitoring. Solutions include strengthened international space treaties, norms against space weapons testing, and collaborative space governance frameworks.",
    severity: 7,
    urgency: 6,
    solvability: 5,
    categories: ["Security", "Technology", "Governance"],
    discussions: 41,
    solutions: 18
  }
];
