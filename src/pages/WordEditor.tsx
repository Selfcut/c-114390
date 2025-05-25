
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWords, WordCreateInput, WordUpdateInput } from '@/hooks/useWords';
import { WordEditor } from '@/components/words/WordEditor';

const WordEditorPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { useWord, createWord, updateWord } = useWords();
  const { data: word, isLoading } = useWord(id);
  
  useEffect(() => {
    // Redirect if trying to edit a non-existent word
    if (!isLoading && isEditing && !word) {
      navigate('/words');
    }
  }, [word, isLoading, isEditing, navigate]);

  const handleSubmit = async (wordData: WordCreateInput | WordUpdateInput) => {
    try {
      if (isEditing && id) {
        await updateWord.mutateAsync({ id, wordData });
        navigate(`/words/${id}`);
      } else {
        const result = await createWord.mutateAsync(wordData as WordCreateInput);
        navigate(`/words/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return (
    <div className="container py-8">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>Loading...</p>
        </div>
      ) : (
        <WordEditor
          word={word}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          isSubmitting={createWord.isPending || updateWord.isPending}
        />
      )}
    </div>
  );
};

export default WordEditorPage;
