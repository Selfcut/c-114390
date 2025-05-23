
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, Rss } from 'lucide-react';
import { ContentViewMode } from '@/types/unified-content-types';

interface ViewSwitcherProps {
  activeMode: ContentViewMode;
  onModeChange: (mode: ContentViewMode) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  activeMode,
  onModeChange
}) => {
  const viewModes = [
    { key: 'list' as ContentViewMode, label: 'List', icon: List },
    { key: 'grid' as ContentViewMode, label: 'Grid', icon: Grid },
    { key: 'feed' as ContentViewMode, label: 'Feed', icon: Rss }
  ];

  return (
    <div className="flex border rounded-lg p-1">
      {viewModes.map((mode) => {
        const Icon = mode.icon;
        return (
          <Button
            key={mode.key}
            variant={activeMode === mode.key ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(mode.key)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
