
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { polymathToast } from "./ui/use-toast";
import { FeaturedAppCard } from "./FeaturedAppCard";

export const FeaturedDisciplines = () => {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<'popular' | 'new' | 'all'>('popular');

  const handleSortChange = (option: 'popular' | 'new' | 'all') => {
    setSortOption(option);
    if (option === 'new') {
      polymathToast.searchComplete(disciplines.length);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 text-sm rounded-md ${sortOption === 'popular' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => handleSortChange('popular')}
          >
            Popular
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${sortOption === 'new' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => handleSortChange('new')}
          >
            New
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md ${sortOption === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => handleSortChange('all')}
          >
            All
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="flex gap-2 bg-gray-800 p-1 rounded-md">
          <button 
            className={`p-2 rounded ${displayMode === 'grid' ? 'bg-gray-700' : ''}`}
            onClick={() => setDisplayMode('grid')}
            title="Grid view"
          >
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-current"></div>
              <div className="w-2 h-2 bg-current"></div>
              <div className="w-2 h-2 bg-current"></div>
              <div className="w-2 h-2 bg-current"></div>
            </div>
          </button>
          <button 
            className={`p-2 rounded ${displayMode === 'list' ? 'bg-gray-700' : ''}`}
            onClick={() => setDisplayMode('list')}
            title="List view"
          >
            <div className="flex flex-col gap-0.5">
              <div className="w-4 h-1 bg-current"></div>
              <div className="w-4 h-1 bg-current"></div>
              <div className="w-4 h-1 bg-current"></div>
            </div>
          </button>
        </div>
      </div>

      <div className={displayMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
        <FeaturedAppCard 
          title="Mathematics & Logic"
          subtitle="Foundational Thinking"
          imageSrc="/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png"
          isNew
        />
        <FeaturedAppCard 
          title="Physics & Astronomy"
          subtitle="Natural Sciences"
          imageSrc="/lovable-uploads/8827d443-a68b-4bd9-998f-3c4c410510e9.png"
        />
        <FeaturedAppCard 
          title="Philosophy & Ethics"
          subtitle="Conceptual Frameworks"
          imageSrc="/lovable-uploads/0c6db754-b805-46e5-a4b8-319a9d8fef71.png"
        />
        <FeaturedAppCard 
          title="Computer Science"
          subtitle="Computational Thinking"
          imageSrc="/lovable-uploads/12cd0679-f352-498e-a6ad-9faaa1ffbec9.png"
        />
      </div>
      
      <div className={displayMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6" : "flex flex-col gap-4 mt-6"}>
        <FeaturedAppCard 
          title="Literature & Arts"
          subtitle="Creative Expression"
          imageSrc="/lovable-uploads/142dea30-a410-4e79-84d0-70189e8fcd07.png"
        />
        <FeaturedAppCard 
          title="History & Anthropology"
          subtitle="Human Evolution"
          imageSrc="/lovable-uploads/d16f3783-6af1-4327-8936-c5a50eb0cab5.png"
        />
        <FeaturedAppCard 
          title="Biology & Medicine"
          subtitle="Life Sciences"
          imageSrc="/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png"
        />
        <FeaturedAppCard 
          title="Psychology & Cognition"
          subtitle="Mind Sciences"
          imageSrc="/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png"
        />
      </div>
      
      <div className="flex justify-center mt-8">
        <button className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium">
          Explore All Disciplines
          <BookOpen size={16} />
        </button>
      </div>
    </>
  );
};

// Need to define disciplines for the handleSortChange function
const disciplines = [
  "Mathematics & Logic",
  "Physics & Astronomy",
  "Philosophy & Ethics",
  "Computer Science",
  "Literature & Arts",
  "History & Anthropology",
  "Biology & Medicine",
  "Psychology & Cognition"
];
