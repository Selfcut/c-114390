
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { ContentViewMode } from '@/types/unified-content-types';

// Export ViewMode type for backwards compatibility
export type ViewMode = ContentViewMode;

interface ViewSwitcherProps {
  activeMode: ContentViewMode;
  onModeChange: (mode: ContentViewMode) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex items-center gap-1 border rounded-md">
      <Button
        variant={activeMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        className="px-2.5 py-1.5 h-auto"
        onClick={() => onModeChange('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid size={16} />
      </Button>
      
      <Button
        variant={activeMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        className="px-2.5 py-1.5 h-auto"
        onClick={() => onModeChange('list')}
        aria-label="List view"
      >
        <List size={16} />
      </Button>
    </div>
  );
};
