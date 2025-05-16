
import { Filter, LayoutGrid, List } from "lucide-react";
import { Book } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LibraryFiltersProps {
  difficultySetting: 'all' | 'beginner' | 'intermediate' | 'advanced';
  setDifficultySetting: (value: 'all' | 'beginner' | 'intermediate' | 'advanced') => void;
  activeCategory: string | null;
  setActiveCategory: (value: string | null) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
  allCategories: string[];
  onResetFilters: () => void;
}

export const LibraryFilters = ({ 
  difficultySetting, 
  setDifficultySetting, 
  activeCategory, 
  setActiveCategory, 
  viewMode, 
  setViewMode,
  allCategories,
  onResetFilters
}: LibraryFiltersProps) => {
  const showResetButton = activeCategory || difficultySetting !== 'all';
  
  return (
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
      
      {showResetButton && (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};
