
import { BookOpen, MessageSquare, Book, Users } from "lucide-react";

export const KnowledgePathways = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
        <div className="p-3 rounded-lg bg-[#3A3600] mr-4 flex items-center justify-center">
          <BookOpen size={24} className="text-[#FFD426]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">Interdisciplinary Studies</h3>
            <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
              New
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">Connect concepts across fields</p>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
        <div className="p-3 rounded-lg bg-[#00361F] mr-4 flex items-center justify-center">
          <MessageSquare size={24} className="text-[#00A67E]" />
        </div>
        <div>
          <h3 className="font-medium text-white">Discussion Forums</h3>
          <p className="text-sm text-gray-400 mt-1">Engage in intellectual discourse</p>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
        <div className="p-3 rounded-lg bg-[#360036] mr-4 flex items-center justify-center">
          <Book size={24} className="text-[#FF3EA5]" />
        </div>
        <div>
          <h3 className="font-medium text-white">Knowledge Library</h3>
          <p className="text-sm text-gray-400 mt-1">Access our curated wiki resources</p>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
        <div className="p-3 rounded-lg bg-[#36003B] mr-4 flex items-center justify-center">
          <MessageSquare size={24} className="text-[#FF3EA5]" />
        </div>
        <div>
          <h3 className="font-medium text-white">Discord Community</h3>
          <p className="text-sm text-gray-400 mt-1">Join real-time discussions</p>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
        <div className="p-3 rounded-lg bg-[#3A3600] mr-4 flex items-center justify-center">
          <Users size={24} className="text-[#FFD426]" />
        </div>
        <div>
          <h3 className="font-medium text-white">Mentorship Network</h3>
          <p className="text-sm text-gray-400 mt-1">Connect with fellow polymaths</p>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex items-start">
        <div className="p-3 rounded-lg bg-[#003619] mr-4 flex items-center justify-center">
          <MessageSquare size={24} className="text-[#00A67E]" />
        </div>
        <div>
          <h3 className="font-medium text-white">Expert Q&A</h3>
          <p className="text-sm text-gray-400 mt-1">Ask questions, get scholarly answers</p>
        </div>
      </div>
    </div>
  );
};
