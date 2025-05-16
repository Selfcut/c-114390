
import { useState, useEffect } from "react";
import { KnowledgeEntryCard } from "../components/KnowledgeEntryCard";
import { polymathToast } from "../components/ui/use-toast";
import { Library as LibraryIcon, PenSquare, Book, Search, Filter, LayoutGrid, List } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex justify-between items-center mb-8 stagger-fade w-full">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <LibraryIcon size={28} />
          Knowledge Library
        </h1>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
          onClick={handleCreateEntry}
        >
          <PenSquare size={18} />
          <span>Contribute Knowledge</span>
        </Button>
      </div>
      
      <div className="bg-card rounded-lg p-4 mb-8 shadow-md border border-border w-full">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search the library..."
              className="w-full bg-background border border-input rounded-md py-2 pl-10 pr-4 text-foreground focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-background border-input hover:bg-muted hover:text-foreground"
                >
                  <Filter size={16} />
                  <span>Category</span>
                  {activeCategory && <Badge className="bg-primary ml-2 text-xs">{activeCategory}</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border w-56">
                {allCategories.map((category, index) => (
                  <DropdownMenuItem 
                    key={index}
                    className={`flex items-center gap-2 ${activeCategory === category ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                  >
                    <Book size={16} />
                    <span>{category}</span>
                  </DropdownMenuItem>
                ))}
                {activeCategory && (
                  <DropdownMenuItem 
                    className="flex items-center gap-2 border-t border-border mt-1 pt-1 hover:bg-muted"
                    onClick={() => setActiveCategory(null)}
                  >
                    <span>Clear category filter</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-background border-input hover:bg-muted hover:text-foreground"
                >
                  <span>Difficulty: {difficultySetting.charAt(0).toUpperCase() + difficultySetting.slice(1)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem 
                  className={`${difficultySetting === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setDifficultySetting('all')}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`${difficultySetting === 'beginner' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setDifficultySetting('beginner')}
                >
                  Beginner
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`${difficultySetting === 'intermediate' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setDifficultySetting('intermediate')}
                >
                  Intermediate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`${difficultySetting === 'advanced' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setDifficultySetting('advanced')}
                >
                  Advanced
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex rounded-md overflow-hidden border border-input">
              <Button 
                variant="ghost" 
                size="icon"
                className={`rounded-none ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={`rounded-none ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </Button>
            </div>
            
            {(activeCategory || searchTerm || difficultySetting !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 stagger-fade w-full`}>
        {filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
            <KnowledgeEntryCard
              key={entry.id}
              title={entry.title}
              author={entry.author}
              readTime={entry.readTime}
              createdAt={entry.createdAt}
              summary={entry.summary}
              categories={entry.categories}
              coverImage={entry.coverImage}
              onClick={() => handleEntryClick(entry.id)}
            />
          ))
        ) : (
          <div className="bg-card rounded-lg p-8 text-center col-span-full border border-border w-full">
            <Book size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No knowledge entries found matching your search criteria.</p>
            <Button 
              className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors hover-lift"
              onClick={handleResetFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-card rounded-lg p-6 border border-border w-full">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recommended Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-fade w-full">
          <div className="bg-muted p-4 rounded-lg hover-lift cursor-pointer w-full">
            <h3 className="text-foreground font-medium">Foundations of Systems Thinking</h3>
            <p className="text-sm text-muted-foreground mt-1">5 modules • 3 hours total</p>
            <Button className="mt-3 w-full bg-primary hover:bg-primary/90 text-white text-sm py-1.5 rounded transition-colors">
              Begin Path
            </Button>
          </div>
          <div className="bg-muted p-4 rounded-lg hover-lift cursor-pointer w-full">
            <h3 className="text-foreground font-medium">Philosophy of Science</h3>
            <p className="text-sm text-muted-foreground mt-1">8 modules • 6 hours total</p>
            <Button className="mt-3 w-full bg-primary hover:bg-primary/90 text-white text-sm py-1.5 rounded transition-colors">
              Begin Path
            </Button>
          </div>
          <div className="bg-muted p-4 rounded-lg hover-lift cursor-pointer w-full">
            <h3 className="text-foreground font-medium">Mathematical Thinking</h3>
            <p className="text-sm text-muted-foreground mt-1">6 modules • 4 hours total</p>
            <Button className="mt-3 w-full bg-primary hover:bg-primary/90 text-white text-sm py-1.5 rounded transition-colors">
              Begin Path
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Library;
