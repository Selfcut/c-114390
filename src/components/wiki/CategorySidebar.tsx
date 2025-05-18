
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Code, 
  Binary, 
  BrainCircuit, 
  Dna, 
  Atom, 
  History, 
  GraduationCap,
  Globe,
  BookOpenCheck,
  TreePine,
  Clock
} from "lucide-react";

interface CategorySidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  disabled?: boolean;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  selectedCategory, 
  setSelectedCategory,
  disabled = false
}) => {
  const categories = [
    { name: "All Categories", icon: BookOpen, value: null },
    { name: "Computer Science", icon: Code, value: "Computer Science" },
    { name: "Mathematics", icon: Binary, value: "Mathematics" },
    { name: "Neuroscience", icon: BrainCircuit, value: "Neuroscience" },
    { name: "Biology", icon: Dna, value: "Biology" },
    { name: "Physics", icon: Atom, value: "Physics" },
    { name: "History", icon: History, value: "History" },
    { name: "Philosophy", icon: BookOpenCheck, value: "Philosophy" },
    { name: "Geography", icon: Globe, value: "Geography" },
    { name: "Education", icon: GraduationCap, value: "Education" },
    { name: "Environment", icon: TreePine, value: "Environment" },
    { name: "Future Studies", icon: Clock, value: "Future Studies" }
  ];

  return (
    <div className="space-y-1">
      <h3 className="font-medium mb-3">Categories</h3>
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = category.value === selectedCategory || (category.value === null && selectedCategory === null);
        
        return (
          <Button
            key={category.name}
            variant={isActive ? "default" : "ghost"}
            className="justify-start w-full"
            onClick={() => setSelectedCategory(category.value)}
            disabled={disabled}
          >
            <Icon className="mr-2 h-4 w-4" />
            {category.name}
          </Button>
        );
      })}
    </div>
  );
};
