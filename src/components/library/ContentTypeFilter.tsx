
import React from 'react';
import { BookOpen, Image, Quote, Brain, Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ContentType } from '@/types/unified-content-types';

interface ContentTypeFilterProps {
  activeType: string;
  onTypeChange: (type: string) => void;
  className?: string;
}

export const ContentTypeFilter = ({ activeType, onTypeChange, className }: ContentTypeFilterProps) => {
  const contentTypes = [
    { id: 'all', label: 'All', icon: <BookOpen size={16} /> },
    { id: 'knowledge', label: 'Knowledge', icon: <BookOpen size={16} /> },
    { id: 'media', label: 'Media', icon: <Image size={16} /> },
    { id: 'quote', label: 'Quotes', icon: <Quote size={16} /> },
    { id: 'forum', label: 'Forum', icon: <Users size={16} /> },
    { id: 'wiki', label: 'Wiki', icon: <Globe size={16} /> },
    { id: 'ai', label: 'AI Generated', icon: <Brain size={16} /> },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {contentTypes.map((type) => (
        <Button
          key={type.id}
          size="sm"
          variant={activeType === type.id ? "default" : "outline"}
          className="flex items-center gap-1.5"
          onClick={() => onTypeChange(type.id)}
        >
          {type.icon}
          <span>{type.label}</span>
        </Button>
      ))}
    </div>
  );
};
