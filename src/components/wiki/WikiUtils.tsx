
import React from "react";
import { FileText } from "lucide-react";
import { categories } from "./CategorySidebar";

// Get icon for category
export const getCategoryIcon = (categoryId: string): React.ReactNode => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.icon : <FileText size={18} />;
};

// Filter articles based on search and category
export const filterArticles = (
  articles: any[],
  searchQuery: string,
  selectedCategory: string | null
) => {
  return articles.filter(article => {
    const matchesSearch = searchQuery ? 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    const matchesCategory = selectedCategory ? 
      article.category === selectedCategory
      : true;
      
    return matchesSearch && matchesCategory;
  });
};
