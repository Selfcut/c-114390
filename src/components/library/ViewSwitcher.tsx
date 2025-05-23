
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list' | 'feed';

interface ViewSwitcherProps {
  activeView: ViewMode;
  onChange: (view: ViewMode) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ activeView, onChange }) => {
  return (
    <div className="flex items-center gap-1 border rounded-md">
      <Button
        variant={activeView === 'grid' ? 'default' : 'ghost'}
        size="sm"
        className="px-2.5 py-1.5 h-auto"
        onClick={() => onChange('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid size={16} />
      </Button>
      
      <Button
        variant={activeView === 'list' ? 'default' : 'ghost'}
        size="sm"
        className="px-2.5 py-1.5 h-auto"
        onClick={() => onChange('list')}
        aria-label="List view"
      >
        <List size={16} />
      </Button>
    </div>
  );
};
