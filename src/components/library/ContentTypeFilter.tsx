
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentType } from '@/types/unified-content-types';

interface ContentTypeFilterProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

const contentTypes = [
  { key: 'all', label: 'All', icon: '🌐' },
  { key: 'quote', label: 'Quotes', icon: '💭' },
  { key: 'knowledge', label: 'Knowledge', icon: '📚' },
  { key: 'media', label: 'Media', icon: '🎬' },
  { key: 'forum', label: 'Forum', icon: '💬' },
  { key: 'wiki', label: 'Wiki', icon: '📝' },
  { key: 'ai', label: 'AI', icon: '🤖' }
];

export const ContentTypeFilter: React.FC<ContentTypeFilterProps> = ({
  activeType,
  onTypeChange
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {contentTypes.map((type) => (
        <Button
          key={type.key}
          variant={activeType === type.key ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeChange(type.key)}
          className="flex items-center gap-2"
        >
          <span>{type.icon}</span>
          {type.label}
          {activeType === type.key && (
            <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
              Active
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};
