
import React from 'react';
import { BookOpen, GraduationCap, Atom, Stethoscope, Building2, Globe, Users, Rocket, Brain, Laptop, Palette, Leaf } from 'lucide-react';

export const categories = [
  { id: "Philosophy", name: "Philosophy", icon: Brain, count: 12 },
  { id: "Science", name: "Science", icon: Atom, count: 24 },
  { id: "Technology", name: "Technology", icon: Laptop, count: 18 },
  { id: "Education", name: "Education", icon: GraduationCap, count: 15 },
  { id: "Health", name: "Health", icon: Stethoscope, count: 10 },
  { id: "Business", name: "Business", icon: Building2, count: 8 },
  { id: "History", name: "History", icon: BookOpen, count: 20 },
  { id: "Geography", name: "Geography", icon: Globe, count: 6 },
  { id: "Society", name: "Society", icon: Users, count: 14 },
  { id: "Space", name: "Space", icon: Rocket, count: 9 },
  { id: "Arts", name: "Arts", icon: Palette, count: 11 },
  { id: "Environment", name: "Environment", icon: Leaf, count: 7 }
];

interface CategorySidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  selectedCategory, 
  setSelectedCategory 
}) => {
  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="font-semibold text-lg mb-4">Categories</h2>
      <div className="space-y-1">
        <button
          className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
            selectedCategory === null ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          <span className="flex items-center gap-2">
            <BookOpen size={18} />
            <span>All Categories</span>
          </span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
              selectedCategory === category.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/50"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="flex items-center gap-2">
              <category.icon size={18} />
              <span>{category.name}</span>
            </span>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
