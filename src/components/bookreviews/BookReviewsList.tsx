
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, Calendar, User, ThumbsUp, MessageSquare } from "lucide-react";

interface BookReview {
  id: string;
  title: string;
  bookTitle: string;
  author: string;
  reviewAuthor: string;
  content: string;
  rating: number;
  likes: number;
  comments: number;
  date: Date;
  genre: string;
  coverImage?: string;
}

interface BookReviewsListProps {
  searchQuery: string;
  selectedGenre: string | null;
}

// Sample data for UI presentation - replace with real data fetching
const sampleBookReviews: BookReview[] = [
  {
    id: '1',
    title: 'A Comprehensive Analysis of Modern Physics',
    bookTitle: 'The Elegant Universe',
    author: 'Brian Greene',
    reviewAuthor: 'Dr. Alex Johnson',
    content: 'This book presents string theory in a way that's accessible to non-specialists while still maintaining scientific rigor...',
    rating: 4.8,
    likes: 47,
    comments: 12,
    date: new Date('2025-04-15'),
    genre: 'science',
    coverImage: '/placeholder.svg',
  },
  {
    id: '2',
    title: 'Rethinking Consciousness',
    bookTitle: 'Consciousness Explained',
    author: 'Daniel Dennett',
    reviewAuthor: 'Prof. Emma Wilson',
    content: 'Dennett tackles the hard problem of consciousness with a materialist perspective that challenges traditional views...',
    rating: 4.5,
    likes: 36,
    comments: 8,
    date: new Date('2025-03-28'),
    genre: 'philosophy',
  },
  {
    id: '3',
    title: 'Mathematical Beauty Unveiled',
    bookTitle: 'Gödel, Escher, Bach',
    author: 'Douglas Hofstadter',
    reviewAuthor: 'Dr. Michael Chen',
    content: 'An extraordinary exploration of cognition, consciousness, and mathematical beauty through the lens of Gödel's theorem...',
    rating: 4.9,
    likes: 62,
    comments: 15,
    date: new Date('2025-05-02'),
    genre: 'mathematics',
    coverImage: '/placeholder.svg',
  },
  {
    id: '4',
    title: 'The Evolution of Human Psychology',
    bookTitle: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    reviewAuthor: 'Dr. Sarah Miller',
    content: 'Kahneman presents his groundbreaking work on cognitive biases and heuristics in decision making...',
    rating: 4.7,
    likes: 53,
    comments: 21,
    date: new Date('2025-04-10'),
    genre: 'psychology',
  },
];

export const BookReviewsList = ({ searchQuery, selectedGenre }: BookReviewsListProps) => {
  // Filter book reviews based on search query and selected genre
  const filteredReviews = sampleBookReviews.filter(review => {
    const matchesSearch = searchQuery 
      ? review.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.author.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesGenre = selectedGenre 
      ? review.genre === selectedGenre
      : true;
    
    return matchesSearch && matchesGenre;
  });
  
  // Helper function to render stars based on rating
  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };
  
  return (
    <div>
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No book reviews found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {review.coverImage && (
                  <div className="md:w-1/4 lg:w-1/5 h-48 md:h-auto">
                    <img 
                      src={review.coverImage} 
                      alt={review.bookTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`${review.coverImage ? 'md:w-3/4 lg:w-4/5' : 'w-full'} flex flex-col`}>
                  <CardHeader className="py-4 px-6">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">{review.genre}</Badge>
                      <div className="flex items-center">
                        {renderRating(review.rating)}
                        <span className="ml-2 text-sm font-medium">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{review.title}</h3>
                    <div className="text-muted-foreground">
                      <p className="font-medium">{review.bookTitle}</p>
                      <p className="text-sm">by {review.author}</p>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <User className="h-3 w-3 mr-1" />
                      <span>Reviewed by {review.reviewAuthor}</span>
                      <Calendar className="h-3 w-3 ml-4 mr-1" />
                      <span>{review.date.toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2 px-6">
                    <p className="text-sm text-muted-foreground line-clamp-3">{review.content}</p>
                  </CardContent>
                  <CardFooter className="py-3 px-6 border-t flex justify-between mt-auto">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {review.likes}
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {review.comments}
                      </div>
                    </div>
                    <a href={`/book-reviews/${review.id}`} className="text-sm text-primary hover:underline">
                      Read full review
                    </a>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
