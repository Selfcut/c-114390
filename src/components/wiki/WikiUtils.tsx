
import React from 'react';
import { BookOpen, Compass, Lightbulb, Dna, Book, PenTool, BookMarked, GraduationCap, PieChart } from 'lucide-react';
import { WikiArticle } from './types';

// Get the appropriate icon for a category
export const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'philosophy':
      return <BookOpen className="h-4 w-4" />;
    case 'science':
      return <Dna className="h-4 w-4" />;
    case 'history':
      return <BookMarked className="h-4 w-4" />;
    case 'art':
      return <PenTool className="h-4 w-4" />;
    case 'education':
      return <GraduationCap className="h-4 w-4" />;
    case 'mathematics':
      return <PieChart className="h-4 w-4" />;
    case 'literature':
      return <Book className="h-4 w-4" />;
    case 'ideas':
      return <Lightbulb className="h-4 w-4" />;
    default:
      return <Compass className="h-4 w-4" />;
  }
};

// Filter articles based on search query and category
export const filterArticles = (
  articles: WikiArticle[], 
  searchQuery: string, 
  selectedCategory: string | null
): WikiArticle[] => {
  return articles.filter(article => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    // Filter by category
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
};

// Format date for display
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Get a list of all unique categories from articles
export const getAllCategories = (articles: WikiArticle[]): string[] => {
  const categories = new Set<string>();
  articles.forEach(article => {
    if (article.category) {
      categories.add(article.category);
    }
  });
  return Array.from(categories);
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
