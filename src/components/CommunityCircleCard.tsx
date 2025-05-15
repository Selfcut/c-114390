
import { ArrowRight } from 'lucide-react';

interface CommunityCircleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode; 
  buttonText: string;
  buttonAction: () => void;
}

export const CommunityCircleCard = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  buttonAction 
}: CommunityCircleCardProps) => {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[#360036]">
          {icon}
        </div>
        <h3 className="font-semibold text-white text-lg">{title}</h3>
      </div>
      
      <p className="text-sm text-gray-300 mb-4">
        {description}
      </p>
      
      <button 
        onClick={buttonAction}
        className="w-full py-2 border border-gray-700 rounded-md hover:bg-gray-800 transition-colors text-blue-400 flex items-center justify-center gap-2"
      >
        <span>{buttonText}</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
