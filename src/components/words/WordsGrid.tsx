
import React from 'react';
import { WordCard } from './WordCard';
import { Word } from '@/hooks/useWords';

interface WordsGridProps {
  words: Word[];
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
}

export const WordsGrid: React.FC<WordsGridProps> = ({ words, onDelete, onToggleVisibility }) => {
  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No writings found</h3>
        <p className="text-muted-foreground">
          Create your first writing by clicking the "New Writing" button above
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {words.map((word) => (
        <WordCard
          key={word.id}
          word={word}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
        />
      ))}
    </div>
  );
};
