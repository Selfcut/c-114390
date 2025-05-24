
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MediaHeaderProps {
  onCreatePost: () => void;
}

export const MediaHeader: React.FC<MediaHeaderProps> = ({ onCreatePost }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Media</h1>
        <p className="text-muted-foreground mt-1">
          Share and discover images, videos, documents, and more
        </p>
      </div>
      <Button onClick={onCreatePost}>
        <Plus className="w-4 h-4 mr-2" />
        Create Post
      </Button>
    </div>
  );
};
