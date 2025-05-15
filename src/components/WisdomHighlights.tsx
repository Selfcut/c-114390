
import { Link } from "react-router-dom";
import { Quote, BookOpen } from "lucide-react";

export const WisdomHighlights = () => {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-lg">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-full bg-[#360036]">
          <Quote size={24} className="text-[#FF3EA5]" />
        </div>
        <div>
          <blockquote className="text-white text-lg font-medium italic mb-2 quote-highlight">
            "The unexamined life is not worth living."
          </blockquote>
          <p className="text-gray-400">— Socrates</p>
        </div>
      </div>
      
      <Link to="/quotes" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
        <span>Explore our wisdom collection</span>
        <BookOpen size={16} />
      </Link>
    </div>
  );
};
