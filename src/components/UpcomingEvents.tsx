
import { Calendar, Users, BrainCircuit } from "lucide-react";
import { polymathToast } from "./ui/use-toast";

export const UpcomingEvents = () => {
  // Functions to handle event interactions
  const handleJoinGroup = () => {
    polymathToast.joinedStudyGroup();
  };

  const handleEventRegistration = () => {
    polymathToast.eventRegistered();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#1A1A1A] p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-lg bg-[#3A3600] mr-4 flex items-center justify-center">
            <Calendar size={20} className="text-[#FFD426]" />
          </div>
          <span className="text-xs text-blue-400">Jun 15</span>
        </div>
        <h3 className="text-lg font-medium text-white mt-4">Virtual Symposium: The Future of Interdisciplinary Research</h3>
        <p className="text-sm text-gray-400 mt-2">Join leading thinkers for a discussion on breaking down academic silos.</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">125 attendees</span>
          <button 
            onClick={handleEventRegistration}  
            className="text-blue-400 text-sm hover:underline"
          >
            Register
          </button>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-lg bg-[#360036] mr-4 flex items-center justify-center">
            <Users size={20} className="text-[#FF3EA5]" />
          </div>
          <span className="text-xs text-blue-400">Jun 22</span>
        </div>
        <h3 className="text-lg font-medium text-white mt-4">Polymath Reading Group: "Gödel, Escher, Bach"</h3>
        <p className="text-sm text-gray-400 mt-2">Monthly discussion of Hofstadter's classic exploration of consciousness and formal systems.</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">42 attendees</span>
          <button 
            onClick={handleJoinGroup}
            className="text-blue-400 text-sm hover:underline"
          >
            Join Group
          </button>
        </div>
      </div>
      
      <div className="bg-[#1A1A1A] p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-lg bg-[#00361F] mr-4 flex items-center justify-center">
            <BrainCircuit size={20} className="text-[#00A67E]" />
          </div>
          <span className="text-xs text-blue-400">Jul 3</span>
        </div>
        <h3 className="text-lg font-medium text-white mt-4">Workshop: Mental Models for Complex Problem Solving</h3>
        <p className="text-sm text-gray-400 mt-2">Learn frameworks for approaching problems across multiple domains.</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">78 attendees</span>
          <button 
            onClick={() => polymathToast.contentRecommended()}
            className="text-blue-400 text-sm hover:underline"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};
