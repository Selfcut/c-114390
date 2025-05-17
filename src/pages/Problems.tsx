
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layouts/PageLayout';
import { ProblemsHeader } from '@/components/problems/ProblemsHeader';
import { ProblemsList } from '@/components/problems/ProblemsList';
import { ProblemsFilters } from '@/components/problems/ProblemsFilters';
import { problemsData } from '@/data/problemsData';

const Problems = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'severity' | 'solvability' | 'urgency'>('severity');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  
  // Filter and sort problems based on user preferences
  const filteredProblems = problemsData
    .filter(problem => 
      (searchTerm ? problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   problem.description.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
      (category ? problem.categories.includes(category) : true)
    )
    .sort((a, b) => {
      if (sortBy === 'severity') return b.severity - a.severity;
      if (sortBy === 'solvability') return a.solvability - b.solvability; // Lower is harder to solve
      return b.urgency - a.urgency;
    });
    
  // Extract unique categories for filtering
  const categories = Array.from(
    new Set(problemsData.flatMap(problem => problem.categories))
  );
  
  const handleProblemClick = (problemId: number) => {
    navigate(`/problems/${problemId}`);
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
        <ProblemsHeader />
        
        <ProblemsFilters 
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
        
        <ProblemsList 
          problems={filteredProblems} 
          onProblemClick={handleProblemClick}
        />
      </div>
    </PageLayout>
  );
};

export default Problems;
