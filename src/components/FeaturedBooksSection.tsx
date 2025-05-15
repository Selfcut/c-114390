
import { Link } from "react-router-dom";
import { Book, Star } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BookInfo {
  id: string;
  title: string;
  author: string;
  description: string;
  rating: number;
  coverImage: string;
}

const featuredBooks: BookInfo[] = [
  {
    id: "alchemists-path",
    title: "The Alchemist's Path",
    author: "Alexandria Hermes",
    description: "A modern guide to practical alchemy and spiritual transformation.",
    rating: 4.8,
    coverImage: "/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png"
  },
  {
    id: "shadows-of-anubis",
    title: "Shadows of Anubis",
    author: "Imhotep Khai",
    description: "Journey through the Egyptian afterlife and the mysteries of death and rebirth.",
    rating: 4.9,
    coverImage: "/lovable-uploads/4255fa40-8036-4424-a210-e3bcd99754df.png"
  },
  {
    id: "ninth-dot",
    title: "The Ninth Dot",
    author: "Sophia Luz",
    description: "Exploring the Council of Nine Dots and their influence throughout history.",
    rating: 4.7,
    coverImage: "/lovable-uploads/b67f802d-430a-4e5a-8755-b61e10470d58.png"
  }
];

export const BookCard = ({ book }: { book: BookInfo }) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden enhanced-card hover-lift">
      <div className="img-zoom-container">
        <AspectRatio ratio={3/4} className="bg-gray-800">
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="object-cover w-full h-full img-zoom"
          />
        </AspectRatio>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white text-lg">{book.title}</h3>
        <div className="flex items-center mt-1 mb-2">
          <span className="text-yellow-400 font-medium mr-1">{book.rating}</span>
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
        </div>
        <p className="text-gray-400 text-sm">By {book.author}</p>
        <p className="text-gray-300 text-sm mt-3 mb-4">{book.description}</p>
        <Link 
          to={`/books/${book.id}`}
          className="inline-block text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export const FeaturedBooksSection = () => {
  return (
    <section className="mb-12 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Featured Books</h2>
        <Link 
          to="/books"
          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          <span>View All Books</span>
          <Book size={16} />
        </Link>
      </div>
      
      <p className="text-gray-300 mb-6">
        Explore our curated collection of books offering deep insights into esoteric knowledge.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
};
