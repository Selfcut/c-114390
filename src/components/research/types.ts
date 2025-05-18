
import { ResearchPaper } from "@/lib/supabase-types";

export interface ResearchItem {
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

export const mapResearchPaperToItem = (paper: ResearchPaper): ResearchItem => ({
  id: paper.id,
  title: paper.title,
  summary: paper.summary || 'No summary available',
  author: paper.author || 'Unknown Author',
  date: new Date(paper.created_at || Date.now()),
  views: paper.views || 0,
  likes: paper.likes || 0,
  category: paper.category || 'general',
  imageUrl: paper.image_url
});
