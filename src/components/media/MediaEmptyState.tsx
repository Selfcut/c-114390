
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Image } from 'lucide-react';

interface MediaEmptyStateProps {
  onCreatePost: () => void;
}

export const MediaEmptyState: React.FC<MediaEmptyStateProps> = ({ onCreatePost }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <Image className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No media posts yet</h3>
          <p className="text-muted-foreground mb-6">
            Start sharing your images, videos, and documents with the community.
          </p>
          <Button onClick={onCreatePost}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
