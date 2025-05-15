
import { BrainCircuit } from "lucide-react";
import { UserProgressCard } from "./UserProgressCard";

export const LearningProgress = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UserProgressCard 
        title="Mathematics & Logic"
        progress={65}
        description="Advanced Set Theory"
        daysStreak={12}
        icon="book"
      />
      <UserProgressCard 
        title="Philosophy"
        progress={38}
        description="Ethics & Moral Philosophy"
        daysStreak={7}
        icon="award"
      />
      <UserProgressCard 
        title="Physics"
        progress={27}
        description="Quantum Mechanics Basics"
        daysStreak={3}
        icon="clock"
      />
      <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col gap-3 justify-center items-center">
        <div className="p-3 rounded-full bg-blue-900">
          <BrainCircuit size={24} className="text-blue-400" />
        </div>
        <p className="text-center text-white font-medium">Explore More Disciplines</p>
        <button className="mt-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm py-1.5 px-4 rounded">
          Browse All
        </button>
      </div>
    </div>
  );
};
