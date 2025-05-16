
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Atom, BookText, Brain, Code, GitBranch, History, Leaf, Calculator, Book } from "lucide-react";

// Export the categories for reuse
export const categories = [
  { id: "physics", name: "Physics", icon: <Atom size={16} /> },
  { id: "mathematics", name: "Mathematics", icon: <Calculator size={16} /> },
  { id: "philosophy", name: "Philosophy", icon: <Book size={16} /> },
  { id: "consciousness", name: "Consciousness", icon: <Brain size={16} /> },
  { id: "systems", name: "Systems Theory", icon: <GitBranch size={16} /> },
  { id: "biology", name: "Biology", icon: <Leaf size={16} /> },
  { id: "psychology", name: "Psychology", icon: <BookText size={16} /> },
  { id: "computer-science", name: "Computer Science", icon: <Code size={16} /> },
  { id: "history", name: "History", icon: <History size={16} /> },
];

interface CategorySidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const CategorySidebar = ({ selectedCategory, setSelectedCategory }: CategorySidebarProps) => {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-3">Categories</h3>
      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-1 pr-3">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            className="justify-start w-full font-normal"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>

          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="justify-start w-full font-normal"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
