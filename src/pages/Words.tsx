
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/lib/auth';
import { useWords } from '@/hooks/useWords';
import { WordsFilter } from '@/components/words/WordsFilter';
import { WordsGrid } from '@/components/words/WordsGrid';
import { Plus } from 'lucide-react';

const WordsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    words, 
    publicWords,
    isLoadingWords, 
    filter, 
    setFilter, 
    deleteWord, 
    toggleVisibility 
  } = useWords();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Get unique categories from all words
  const categories = useMemo(() => {
    const allWords = [...(Array.isArray(words) ? words : []), ...publicWords];
    const uniqueCategories = Array.from(
      new Set(allWords.map(word => word.category))
    ).filter(Boolean);
    return uniqueCategories;
  }, [words, publicWords]);

  // Filter words based on search query and category
  const filteredWords = useMemo(() => {
    if (!Array.isArray(words)) {
      return [];
    }
    
    let result = [...words];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(word => 
        word.title.toLowerCase().includes(query) || 
        word.content.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter) {
      result = result.filter(word => word.category === categoryFilter);
    }
    
    return result;
  }, [words, searchQuery, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this writing?')) {
      await deleteWord.mutateAsync(id);
    }
  };

  const handleToggleVisibility = async (id: string, isPublic: boolean) => {
    await toggleVisibility.mutateAsync({ id, isPublic });
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Words</h1>
          <Button onClick={() => navigate('/words/new')}>
            <Plus size={16} className="mr-2" />
            New Writing
          </Button>
        </div>
        
        <WordsFilter
          filter={filter}
          setFilter={setFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
        />
        
        <div className="mt-6">
          {isLoadingWords ? (
            <div className="flex justify-center py-12">
              <p>Loading writings...</p>
            </div>
          ) : (
            <WordsGrid
              words={filteredWords}
              onDelete={handleDelete}
              onToggleVisibility={handleToggleVisibility}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default WordsPage;
