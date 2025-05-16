import { useState, useEffect } from "react";
import { polymathToast } from "../components/ui/use-toast";
import { LibraryHeader } from "../components/library/LibraryHeader";
import { LibrarySearchBar } from "../components/library/LibrarySearchBar";
import { LibraryFilters } from "../components/library/LibraryFilters";
import { KnowledgeEntryList } from "../components/library/KnowledgeEntryList";
import { LearningPathRecommendations } from "../components/library/LearningPathRecommendations";

// Mock knowledge entries
const knowledgeEntries = [
  {
    id: "1",
    title: "Introduction to Systems Thinking",
    author: "ComplexityScholar",
    readTime: "15 min read",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    summary: "A comprehensive overview of systems thinking principles and how they can be applied across various disciplines to solve complex problems.",
    categories: ["Systems Theory", "Complexity", "Methodology"],
    coverImage: "/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png"
  },
  {
    id: "2",
    title: "The Mathematics of Music: Harmony and Frequency",
    author: "HarmonicsExpert",
    readTime: "12 min read",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    summary: "An exploration of the mathematical principles underlying musical harmony, frequency relationships, and how they relate to human perception of sound.",
    categories: ["Mathematics", "Music", "Physics"],
    coverImage: "/lovable-uploads/92333427-5a32-4cf8-b110-afc5b57c9f27.png"
  },
  {
    id: "3",
    title: "Neural Networks: From Biology to Computation",
    author: "BioComputation",
    readTime: "20 min read",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    summary: "A deep dive into how biological neural networks inspired artificial neural networks, with comparisons between brain function and modern deep learning architectures.",
    categories: ["Neuroscience", "Computer Science", "AI"],
    coverImage: "/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png"
  },
  {
    id: "4",
    title: "Epistemology in the Age of Information",
    author: "KnowledgePhilosopher",
    readTime: "18 min read",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    summary: "How our understanding of knowledge and truth has evolved in the digital age, and the philosophical challenges posed by information abundance.",
    categories: ["Philosophy", "Information Theory", "Epistemology"],
    coverImage: "/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png"
  }
];

// Extract all unique categories from entries
const allCategories = [...new Set(knowledgeEntries.flatMap(entry => entry.categories))];

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultySetting, setDifficultySetting] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filteredEntries, setFilteredEntries] = useState(knowledgeEntries);
  
  // Filter entries based on search, difficulty, and categories
  useEffect(() => {
    let results = knowledgeEntries;
    
    // Apply search filtering
    if (searchTerm) {
      results = results.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
        entry.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filtering
    if (activeCategory) {
      results = results.filter(entry =>
        entry.categories.includes(activeCategory)
      );
    }
    
    // Apply difficulty filtering (placeholder logic)
    if (difficultySetting !== 'all') {
      // In a real app, entries would have difficulty ratings
      // This is just a placeholder filter that keeps some entries based on difficulty
      switch(difficultySetting) {
        case 'beginner':
          results = results.filter(entry => entry.id !== '3');
          break;
        case 'intermediate':
          results = results.filter(entry => entry.id !== '1' && entry.id !== '4');
          break;
        case 'advanced':
          results = results.filter(entry => entry.id === '3');
          break;
      }
    }
    
    setFilteredEntries(results);
  }, [searchTerm, difficultySetting, activeCategory]);
  
  const handleEntryClick = (id: string) => {
    // In a real app, this would navigate to the entry detail page
    console.log('Entry clicked:', id);
    polymathToast.resourceBookmarked();
  };
  
  const handleCreateEntry = () => {
    polymathToast.contributionSaved();
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setDifficultySetting('all');
    setActiveCategory(null);
  };
  
  return (
    <main className="container mx-auto py-8 w-full">
      <LibraryHeader onCreateEntry={handleCreateEntry} />
      
      <div className="bg-card rounded-lg p-4 mb-8 shadow-md border border-border w-full">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <LibrarySearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          <LibraryFilters 
            difficultySetting={difficultySetting}
            setDifficultySetting={setDifficultySetting}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
            allCategories={allCategories}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
      
      <KnowledgeEntryList 
        entries={filteredEntries} 
        viewMode={viewMode} 
        onEntryClick={handleEntryClick}
        onResetFilters={handleResetFilters}
      />
      
      <LearningPathRecommendations />
    </main>
  );
};

export default Library;
