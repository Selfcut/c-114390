
import React from 'react';
import { BookOpen, Image, Quote, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ContentType = 'all' | 'knowledge' | 'media' | 'quotes' | 'ai';

interface ContentTypeFilterProps {
  activeType: ContentType;
  onChange: (type: ContentType) => void;
  className?: string;
}

export const ContentTypeFilter = ({ activeType, onChange, className }: ContentTypeFilterProps) => {
  const contentTypes = [
    { id: 'all', label: 'All', icon: <BookOpen size={16} /> },
    { id: 'knowledge', label: 'Knowledge', icon: <BookOpen size={16} /> },
    { id: 'media', label: 'Media', icon: <Image size={16} /> },
    { id: 'quotes', label: 'Quotes', icon: <Quote size={16} /> },
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
          onClick={() => onChange(type.id as ContentType)}
        >
          {type.icon}
          <span>{type.label}</span>
        </Button>
      ))}
    </div>
  );
};
