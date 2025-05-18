
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
}

// Sample data for UI presentation - replace with real data fetching
const sampleResearchData: ResearchItem[] = [
  {
    id: '1',
    title: 'Quantum Computing Advances in Neural Networks',
    summary: 'Recent advances in quantum computing applied to neural networks show promising results for AI acceleration.',
    author: 'Dr. Emma Roberts',
    date: new Date('2025-03-15'),
    views: 342,
    likes: 78,
    category: 'physics',
    imageUrl: '/placeholder.svg',
  },
  {
    id: '2',
    title: 'Mathematical Models of Consciousness',
    summary: 'New mathematical frameworks to model aspects of consciousness and cognitive processes.',
    author: 'Prof. James Liu',
    date: new Date('2025-04-20'),
    views: 245,
    likes: 53,
    category: 'mathematics',
  },
  {
    id: '3',
    title: 'CRISPR Applications in Neurological Disorders',
    summary: 'Novel applications of CRISPR gene editing technology for treating complex neurological disorders.',
    author: 'Dr. Sarah Johnson',
    date: new Date('2025-05-01'),
    views: 189,
    likes: 41,
    category: 'biology',
  },
  {
    id: '4',
    title: 'Philosophical Implications of Artificial General Intelligence',
    summary: 'Exploring the philosophical questions raised by the development of artificial general intelligence.',
    author: 'Dr. Michael Chen',
    date: new Date('2025-04-10'),
    views: 278,
    likes: 62,
    category: 'philosophy',
  },
];

export const ResearchGrid = ({ searchQuery, selectedCategory }: ResearchGridProps) => {
  // Filter research items based on search query and selected category
  const filteredResearch = sampleResearchData.filter(item => {
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
