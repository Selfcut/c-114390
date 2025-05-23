
import React from 'react';
import { Button } from '@/components/ui/button';
import { PenSquare, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface LibraryHeaderProps {
  onCreateEntry: () => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({ onCreateEntry }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Library</h1>
          <p className="text-muted-foreground">
            Explore and contribute to our collective wisdom
          </p>
        </div>
      </div>
      
      {isAuthenticated && (
        <Button 
          onClick={onCreateEntry}
          className="flex items-center gap-2"
        >
          <PenSquare size={16} />
          <span>Create Entry</span>
        </Button>
      )}
    </div>
  );
};
