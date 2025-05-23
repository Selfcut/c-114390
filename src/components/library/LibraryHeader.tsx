
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Library } from 'lucide-react';

interface LibraryHeaderProps {
  onCreateEntry: () => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({ onCreateEntry }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Library className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">
            Discover and share knowledge, quotes, media, and discussions
          </p>
        </div>
      </div>
      <Button onClick={onCreateEntry} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Create Content
      </Button>
    </div>
  );
};
