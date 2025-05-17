
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, LucideIcon, Book, Lightbulb, Dna, Compass, PenTool, BookMarked, GraduationCap, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryItem {
  name: string;
  id: string;
  icon: LucideIcon;
  count?: number;
}

export const categories: CategoryItem[] = [
  { name: "Philosophy", id: "Philosophy", icon: BookOpen, count: 42 },
  { name: "Science", id: "Science", icon: Dna, count: 37 },
  { name: "History", id: "History", icon: BookMarked, count: 29 },
  { name: "Art", id: "Art", icon: PenTool, count: 22 },
  { name: "Education", id: "Education", icon: GraduationCap, count: 18 },
  { name: "Mathematics", id: "Mathematics", icon: PieChart, count: 16 },
  { name: "Literature", id: "Literature", icon: Book, count: 14 },
  { name: "Ideas", id: "Ideas", icon: Lightbulb, count: 12 }
];

interface CategorySidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  setSelectedCategory
}) => {
  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <div className="space-y-1">
        <Button 
          variant={selectedCategory === null ? "secondary" : "ghost"} 
          className={cn(
            "w-full justify-start",
            selectedCategory === null ? "bg-secondary" : ""
          )}
          onClick={() => handleCategoryClick(null)}
        >
          <Compass className="mr-2 h-4 w-4" />
          All Categories
        </Button>
        
        {categories.map((category) => (
          <Button 
            key={category.name}
            variant={selectedCategory === category.name ? "secondary" : "ghost"} 
            className={cn(
              "w-full justify-start",
              selectedCategory === category.name ? "bg-secondary" : ""
            )}
            onClick={() => handleCategoryClick(category.name)}
          >
            <category.icon className="mr-2 h-4 w-4" />
            {category.name}
            {category.count !== undefined && (
              <span className="ml-auto text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                {category.count}
              </span>
            )}
          </Button>
        ))}
      </div>
    </Card>
  );
};
