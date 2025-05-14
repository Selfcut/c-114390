
import React from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';

export type CardType = "discussion" | "knowledge";

interface CreationCardProps {
  type: CardType;
}

export const CreationCard = ({ type }: CreationCardProps) => {
  const isDiscussion = type === "discussion";
  
  return (
    <div className={`p-6 rounded-xl ${isDiscussion ? 'bg-gradient-to-br from-[#00361F] to-[#002817]' : 'bg-gradient-to-br from-[#360036] to-[#280028]'}`}>
      <div className="mb-4">
        {isDiscussion ? (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#00A67E]/20">
            <MessageSquare size={24} className="text-[#00A67E]" />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF3EA5]/20">
            <BookOpen size={24} className="text-[#FF3EA5]" />
          </div>
        )}
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">
        {isDiscussion ? 'Start a Discussion' : 'Add to Knowledge Library'}
      </h2>
      <p className="text-gray-400 mb-6">
        {isDiscussion 
          ? 'Engage with the community in thoughtful intellectual discourse'
          : 'Contribute to our collective wisdom with research and insights'
        }
      </p>
      <button className={`px-4 py-2 rounded-md text-sm text-white flex items-center gap-2 ${isDiscussion ? 'bg-[#00A67E]' : 'bg-[#FF3EA5]'}`}>
        {isDiscussion ? 'New Discussion' : 'New Entry'}
        {isDiscussion ? <MessageSquare size={16} /> : <BookOpen size={16} />}
      </button>
    </div>
  );
};
