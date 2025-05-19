
import { Problem } from './types';

export const environmentProblems: Problem[] = [
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
];
