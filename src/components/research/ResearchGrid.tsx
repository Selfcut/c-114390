
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Microscope, Eye, ThumbsUp, Calendar } from "lucide-react";

interface ResearchItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  date: Date;
  views: number;
  likes: number;
  category: string;
  imageUrl?: string;
}

interface ResearchGridProps {
  searchQuery: string;
  selectedCategory: string | null;
  researchPapers: ResearchItem[]; // Add this line to accept research papers as a prop
}

export const ResearchGrid = ({ searchQuery, selectedCategory, researchPapers }: ResearchGridProps) => {
  // Filter research items based on search query and selected category
  const filteredResearch = researchPapers.filter(item => {
    const matchesSearch = searchQuery 
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory 
      ? item.category === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div>
      {filteredResearch.length === 0 ? (
        <div className="text-center py-12">
          <Microscope className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No research papers found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResearch.map((research) => (
            <Card key={research.id} className="hover:shadow-md transition-shadow">
              {research.imageUrl && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={research.imageUrl} 
                    alt={research.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="py-4 px-4">
                <div className="flex justify-between">
                  <Badge variant="outline">{research.category}</Badge>
                  <div className="flex items-center text-muted-foreground text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {research.date.toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mt-2 line-clamp-2">{research.title}</h3>
                <p className="text-sm text-muted-foreground">by {research.author}</p>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{research.summary}</p>
              </CardContent>
              <CardFooter className="py-3 px-4 border-t flex justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Eye className="h-4 w-4 mr-1" />
                    {research.views}
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {research.likes}
                  </div>
                </div>
                <a href={`/research/${research.id}`} className="text-sm text-primary hover:underline">Read more</a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
