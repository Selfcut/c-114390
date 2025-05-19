
import { Problem } from './types';

export const worldProblems: Problem[] = [
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
  }
];
