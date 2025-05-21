
import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, Bookmark, Clock, ThumbsUp, TrendingUp, Eye } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DiscussionFiltersProps {
  onSortChange: (sortOption: string) => void;
  onFilterChange: (tag: string | null) => void;
  onSearchChange: (term: string) => void;
  availableTags: string[];
  currentSort?: string;
  currentTag?: string | null;
  currentSearch?: string;
  isLoading?: boolean;
}

export const DiscussionFilters = ({ 
  onSortChange, 
  onFilterChange, 
  onSearchChange,
  availableTags,
  currentSort = 'popular',
  currentTag = null,
  currentSearch = '',
  isLoading = false
}: DiscussionFiltersProps) => {
  const [sortOption, setSortOption] = useState<string>(currentSort);
  const [activeTag, setActiveTag] = useState<string | null>(currentTag);
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  
  // Update local state when props change
  useEffect(() => {
    setSortOption(currentSort);
  }, [currentSort]);
  
  useEffect(() => {
    setActiveTag(currentTag);
  }, [currentTag]);
  
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);
  
  const handleSortChange = (option: string) => {
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveTag(null);
    setSortOption('popular');
    onSearchChange('');
    onFilterChange(null);
    onSortChange('popular');
  };

  const getSortIcon = () => {
    switch(sortOption) {
      case 'popular': return <TrendingUp size={16} />;
      case 'newest': case 'new': return <Clock size={16} />;
      case 'upvotes': return <ThumbsUp size={16} />;
      case 'views': case 'most-viewed': return <Eye size={16} />;
      default: return <ArrowUpDown size={16} />;
    }
  };
  
  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-md border border-border">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search discussions..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={handleSearch}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                {getSortIcon()}
                <span>{sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border">
              <DropdownMenuItem 
                className="flex items-center gap-2"
                onClick={() => handleSortChange('popular')}
              >
                <TrendingUp size={16} />
                <span>Popular</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2"
                onClick={() => handleSortChange('newest')}
              >
                <Clock size={16} />
                <span>New</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2"
                onClick={() => handleSortChange('upvotes')}
              >
                <ThumbsUp size={16} />
                <span>Most Upvoted</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleSortChange('views')}
              >
                <Eye size={16} />
                <span>Most Viewed</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Filter size={16} />
                <span>Topics</span>
                {activeTag && <Badge className="ml-2 text-xs">{activeTag}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border border-border">
              {availableTags.map((tag, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="flex items-center gap-2"
                  onClick={() => handleTagClick(tag)}
                >
                  <Bookmark size={16} />
                  <span>{tag}</span>
                </DropdownMenuItem>
              ))}
              {activeTag && (
                <DropdownMenuItem 
                  className="flex items-center gap-2 border-t mt-1 pt-1"
                  onClick={() => handleTagClick(activeTag)}
                >
                  <span>Clear filter</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(activeTag || searchTerm || sortOption !== 'popular') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearFilters}
              disabled={isLoading}
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
      
      {activeTag && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filter:</span>
          <Badge 
            className="cursor-pointer flex items-center gap-1"
            onClick={() => handleTagClick(activeTag)}
          >
            {activeTag}
            <span className="ml-1">&times;</span>
          </Badge>
        </div>
      )}
    </div>
  );
};
