
import { useState } from 'react';
import { Book, Star, BookOpen } from 'lucide-react';
import { AspectRatio } from './ui/aspect-ratio';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  rating: number;
  description: string;
  coverUrl?: string;
  onClick?: () => void;
}

export const BookCard = ({ id, title, author, rating, description, coverUrl, onClick }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative">
        <AspectRatio ratio={3/4}>
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={`Cover of ${title}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Book size={48} className="text-gray-600" />
            </div>
          )}
        </AspectRatio>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 px-3 py-2">
          <div className="flex items-center text-yellow-400">
            <Star size={16} className="fill-yellow-400" />
            <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-white text-lg mb-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-3">By {author}</p>
        <p className="text-gray-300 text-sm line-clamp-3">{description}</p>
        
        <button 
          className={`mt-4 w-full rounded-md py-2 flex items-center justify-center gap-2 transition-colors ${
            isHovered ? 'bg-blue-600 text-white' : 'bg-gray-800 text-blue-400'
          }`}
        >
          <BookOpen size={16} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};
