
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnowledgeEntryCard } from "../KnowledgeEntryCard";

export interface KnowledgeEntry {
  id: string;
  title: string;
  author: string;
  readTime?: string;
  createdAt: Date;
  summary: string;
  categories?: string[];
  coverImage?: string;
}

interface KnowledgeEntryListProps {
  entries: KnowledgeEntry[];
  viewMode: 'grid' | 'list';
  onEntryClick: (id: string) => void;
  onResetFilters: () => void;
}

export const KnowledgeEntryList = ({ 
  entries, 
  viewMode, 
  onEntryClick, 
  onResetFilters 
}: KnowledgeEntryListProps) => {
  if (entries.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center col-span-full border border-border w-full">
        <Book size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No knowledge entries found matching your search criteria.</p>
        <Button 
          className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors hover-lift"
          onClick={onResetFilters}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`grid gap-4 w-full ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}
      style={{ minWidth: "100%" }}
    >
      {entries.map(entry => (
        <KnowledgeEntryCard
          key={entry.id}
          title={entry.title}
          author={entry.author}
          readTime={entry.readTime}
          createdAt={entry.createdAt}
          summary={entry.summary}
          categories={entry.categories}
          coverImage={entry.coverImage}
          onClick={() => onEntryClick(entry.id)}
          variant={viewMode === 'list' ? 'default' : 'compact'}
        />
      ))}
    </div>
  );
};
