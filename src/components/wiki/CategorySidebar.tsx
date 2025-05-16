
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Atom, Brain, Database, Globe, Lightbulb } from "lucide-react";

interface CategorySidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const categories = [
  { id: "physics", name: "Physics", icon: <Atom size={18} /> },
  { id: "philosophy", name: "Philosophy", icon: <Brain size={18} /> },
  { id: "mathematics", name: "Mathematics", icon: <Database size={18} /> },
  { id: "consciousness", name: "Consciousness", icon: <Lightbulb size={18} /> },
  { id: "systems", name: "Systems Theory", icon: <Globe size={18} /> }
];

export const CategorySidebar = ({ selectedCategory, setSelectedCategory }: CategorySidebarProps) => {
  return (
    <Card className="w-full sticky top-20">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-4">Categories</h2>
        <div className="space-y-1">
          <Button
            variant={!selectedCategory ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSelectedCategory(null)}
          >
            <Globe size={18} className="mr-2" />
            All Categories
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
