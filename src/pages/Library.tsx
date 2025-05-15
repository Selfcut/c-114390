
import { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { KnowledgeEntryCard } from "../components/KnowledgeEntryCard";
import { polymathToast } from "../components/ui/use-toast";
import { Library as LibraryIcon, PenSquare, Book, Search } from "lucide-react";

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

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultySetting, setDifficultySetting] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  
  // Filter entries based on search and difficulty
  const filteredEntries = knowledgeEntries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // In a real app, entries would have difficulty ratings
    // This is just a placeholder logic
    return matchesSearch;
  });
  
  const handleEntryClick = (id: string) => {
    // In a real app, this would navigate to the entry detail page
    console.log('Entry clicked:', id);
    polymathToast.resourceBookmarked();
  };
  
  const handleCreateEntry = () => {
    polymathToast.contributionSaved();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-12">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <LibraryIcon size={28} />
                  Knowledge Library
                </h1>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  onClick={handleCreateEntry}
                >
                  <PenSquare size={18} />
                  <span>Contribute Knowledge</span>
                </button>
              </div>
              
              <div className="bg-[#1A1A1A] rounded-lg p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search the library..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <label className="flex items-center text-gray-400 text-sm">
                      Difficulty:
                    </label>
                    <button 
                      onClick={() => setDifficultySetting('all')}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        difficultySetting === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setDifficultySetting('beginner')}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        difficultySetting === 'beginner' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Beginner
                    </button>
                    <button 
                      onClick={() => setDifficultySetting('intermediate')}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        difficultySetting === 'intermediate' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Intermediate
                    </button>
                    <button 
                      onClick={() => setDifficultySetting('advanced')}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        difficultySetting === 'advanced' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      Advanced
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
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
                  <div className="bg-[#1A1A1A] rounded-lg p-8 text-center">
                    <Book size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No knowledge entries found matching your search.</p>
                    <button 
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-8 bg-[#1A1A1A] rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Recommended Learning Paths</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#222222] p-4 rounded-lg">
                    <h3 className="text-white font-medium">Foundations of Systems Thinking</h3>
                    <p className="text-sm text-gray-400 mt-1">5 modules • 3 hours total</p>
                    <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded transition-colors">
                      Begin Path
                    </button>
                  </div>
                  <div className="bg-[#222222] p-4 rounded-lg">
                    <h3 className="text-white font-medium">Philosophy of Science</h3>
                    <p className="text-sm text-gray-400 mt-1">8 modules • 6 hours total</p>
                    <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded transition-colors">
                      Begin Path
                    </button>
                  </div>
                  <div className="bg-[#222222] p-4 rounded-lg">
                    <h3 className="text-white font-medium">Mathematical Thinking</h3>
                    <p className="text-sm text-gray-400 mt-1">6 modules • 4 hours total</p>
                    <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded transition-colors">
                      Begin Path
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
