
import { useState } from 'react';
import { BookOpen, Award, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ReadingProgressProps {
  bookTitle: string;
  author: string;
  totalPages: number;
  currentPage: number;
  coverImage?: string;
  onProgressUpdate?: (newPage: number) => void;
}

export const ReadingProgress = ({
  bookTitle,
  author,
  totalPages,
  currentPage,
  coverImage,
  onProgressUpdate
}: ReadingProgressProps) => {
  const [page, setPage] = useState(currentPage);
  const progressPercentage = Math.floor((page / totalPages) * 100);
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage <= totalPages) {
      setPage(newPage);
      if (onProgressUpdate) {
        onProgressUpdate(newPage);
      }
      
      // If completed, show congrats toast
      if (newPage === totalPages && currentPage !== totalPages) {
        toast({
          title: "Achievement Unlocked!",
          description: `You've completed "${bookTitle}". Great work!`,
          variant: "default",
        });
      }
    }
  };
  
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 hover-lift">
      <div className="flex gap-4">
        {coverImage && (
          <div className="w-16 h-24 overflow-hidden rounded-md flex-shrink-0">
            <div className="book-cover h-full w-full bg-gray-800 flex items-center justify-center">
              <img src={coverImage} alt={bookTitle} className="object-cover h-full w-full" />
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-medium text-white text-base mb-1">{bookTitle}</h3>
          <p className="text-gray-400 text-xs mb-3">{author}</p>
          
          <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
            <div 
              className="bg-[#6E59A5] h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-[#360036]">
                <BookOpen size={12} className="text-[#FF3EA5]" />
              </div>
              <span className="text-xs text-gray-300">
                {page} / {totalPages} pages
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 0}
                className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                -
              </button>
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReadingList = () => {
  const books = [
    {
      id: 1,
      title: "The Alchemist's Path",
      author: "Alexandria Hermes",
      totalPages: 324,
      currentPage: 156,
      coverImage: "/lovable-uploads/92333427-5a32-4cf8-b110-afc5b57c9f27.png",
    },
    {
      id: 2,
      title: "Shadows of Anubis",
      author: "Imhotep Khai",
      totalPages: 412,
      currentPage: 204,
      coverImage: "/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png",
    },
    {
      id: 3,
      title: "The Ninth Dot",
      author: "Sophia Luz",
      totalPages: 248,
      currentPage: 67,
      coverImage: "/lovable-uploads/4255fa40-8036-4424-a210-e3bcd99754df.png",
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white">Your Reading List</h3>
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">Updated today</span>
        </div>
      </div>
      
      {books.map(book => (
        <ReadingProgress
          key={book.id}
          bookTitle={book.title}
          author={book.author}
          totalPages={book.totalPages}
          currentPage={book.currentPage}
          coverImage={book.coverImage}
        />
      ))}
      
      <button 
        className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
        onClick={() => polymathToast.contentRecommended()}
      >
        <Award size={14} />
        <span>View All Reading Progress</span>
      </button>
    </div>
  );
};
