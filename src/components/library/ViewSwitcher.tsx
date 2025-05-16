
import React from 'react';
import { LayoutGrid, LayoutList, Feed } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list' | 'feed';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
}

export const ViewSwitcher = ({ viewMode, onChange, className }: ViewSwitcherProps) => {
  return (
    <ToggleGroup 
      type="single"
      value={viewMode}
      onValueChange={(value) => value && onChange(value as ViewMode)}
      className={cn("flex border rounded-md overflow-hidden", className)}
    >
      <ToggleGroupItem value="grid" aria-label="Grid view" className="data-[state=on]:bg-accent">
        <LayoutGrid size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view" className="data-[state=on]:bg-accent">
        <LayoutList size={18} />
      </ToggleGroupItem>
      <ToggleGroupItem value="feed" aria-label="Feed view" className="data-[state=on]:bg-accent">
        <Feed size={18} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
