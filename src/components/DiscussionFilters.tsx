
import { useState } from "react";
import { Search, Filter } from "lucide-react";

interface DiscussionFiltersProps {
  onSortChange: (sortOption: 'popular' | 'new' | 'upvotes') => void;
  onFilterChange: (tag: string | null) => void;
  onSearchChange: (term: string) => void;
  availableTags: string[];
}

export const DiscussionFilters = ({ 
  onSortChange, 
  onFilterChange, 
  onSearchChange,
  availableTags 
}: DiscussionFiltersProps) => {
  const [sortOption, setSortOption] = useState<'popular' | 'new' | 'upvotes'>('popular');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSortChange = (option: 'popular' | 'new' | 'upvotes') => {
    setSortOption(option);
    onSortChange(option);
  };
  
  const handleTagClick = (tag: string) => {
    const newTag = activeTag === tag ? null : tag;
    setActiveTag(newTag);
    onFilterChange(newTag);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchChange(term);
  };
  
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => handleSortChange('popular')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              sortOption === 'popular' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Popular
          </button>
          <button 
            onClick={() => handleSortChange('new')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              sortOption === 'new' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            New
          </button>
          <button 
            onClick={() => handleSortChange('upvotes')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              sortOption === 'upvotes' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            Most Upvoted
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-1 text-gray-400 mr-2">
          <Filter size={14} />
          <span className="text-sm">Filter:</span>
        </div>
        
        {availableTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
              activeTag === tag 
                ? 'bg-blue-700 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
