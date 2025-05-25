
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookReviewsHeader } from "@/components/bookreviews/BookReviewsHeader";
import { BookReviewsFilters } from "@/components/bookreviews/BookReviewsFilters";
import { BookReviewsList } from "@/components/bookreviews/BookReviewsList";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Book } from '../components/bookreviews/types';

const BookReviews = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchBooks();
  }, []);
  
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      // Fetch books from Supabase
      const { data, error } = await supabase
        .from('books')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setBooks(data);
      } else {
        // If no books found, create some demo books
        await createDemoBooks();
        const { data: newData } = await supabase.from('books').select('*');
        setBooks(newData || []);
      }
    } catch (error: any) {
      console.error('Error fetching books:', error);
      toast.error(`Failed to load books: ${error.message}`);
      
      // Fallback to demo books if database fetch fails
      setBooks([
        {
          id: '1',
          title: 'The Psychology of Money',
          author: 'Morgan Housel',
          description: 'Timeless lessons on wealth, greed, and happiness.',
          genre: 'Finance',
          published_year: 2020,
          cover_image_url: 'https://m.media-amazon.com/images/I/71TRUbzcvaL._AC_UF1000,1000_QL80_.jpg'
        },
        {
          id: '2',
          title: 'Atomic Habits',
          author: 'James Clear',
          description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
          genre: 'Self-Help',
          published_year: 2018,
          cover_image_url: 'https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg'
        },
        {
          id: '3',
          title: 'Sapiens: A Brief History of Humankind',
          author: 'Yuval Noah Harari',
          description: 'How Homo sapiens became Earth\'s dominant species.',
          genre: 'History',
          published_year: 2014,
          cover_image_url: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create demo books if no books exist
  const createDemoBooks = async () => {
    const demoBooks = [
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness.',
        genre: 'Finance',
        published_year: 2020,
        cover_image_url: 'https://m.media-amazon.com/images/I/71TRUbzcvaL._AC_UF1000,1000_QL80_.jpg'
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
        genre: 'Self-Help',
        published_year: 2018,
        cover_image_url: 'https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg'
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        description: 'How Homo sapiens became Earth\'s dominant species.',
        genre: 'History',
        published_year: 2014,
        cover_image_url: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg'
      }
    ];
    
    try {
      await supabase.from('books').insert(demoBooks);
    } catch (error) {
      console.error('Error creating demo books:', error);
    }
  };
  
  const handleCreateReview = () => {
    navigate('/book-review/new');
  };
  
  const handleBookClick = (bookId: string) => {
    navigate(`/book-reviews/${bookId}`);
  };
  
  // Filter books based on search query and genre
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery ? 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) : 
      true;
      
    const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
    
    return matchesSearch && matchesGenre;
  });
  
  // Extract unique genres
  const genres = Array.from(new Set(books.map(book => book.genre))).filter(Boolean) as string[];
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <BookReviewsHeader onCreateReview={handleCreateReview} />
      <BookReviewsFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        genres={genres}
      />
      <BookReviewsList 
        books={filteredBooks}
        isLoading={isLoading}
        onBookClick={handleBookClick}
      />
    </div>
  );
};

export default BookReviews;
