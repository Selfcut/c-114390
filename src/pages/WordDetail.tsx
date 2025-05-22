
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useWords } from '@/hooks/useWords';
import { WordDetail } from '@/components/words/WordDetail';
import { useAuth } from '@/lib/auth';

const WordDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useWord, deleteWord, toggleVisibility } = useWords();
  
  const { data: word, isLoading, error } = useWord(id);
  
  const handleDelete = async (id: string) => {
    await deleteWord.mutateAsync(id);
    navigate('/words');
  };
  
  const handleToggleVisibility = async (id: string, isPublic: boolean) => {
    await toggleVisibility.mutateAsync({ id, isPublic });
  };

  return (
    <PageLayout>
      <div className="container py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive">Error</h2>
            <p>Unable to load the writing</p>
          </div>
        ) : !word ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Not Found</h2>
            <p>The writing you're looking for doesn't exist or you don't have permission to view it.</p>
          </div>
        ) : (
          <WordDetail 
            word={word}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
            isCurrentUser={user?.id === word.user_id}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default WordDetailPage;
