
import { useState, useEffect } from 'react';
import { X, BookOpen, MessageSquare, Bell } from 'lucide-react';
import { polymathToast } from "../components/ui/use-toast";
import { formatDaysAgo } from "../lib/utils";

export const WelcomeMessage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [lastVisit, setLastVisit] = useState<string | null>(null);
  const [newDiscussions, setNewDiscussions] = useState(0);
  const [newEntries, setNewEntries] = useState(0);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Check for stored username from onboarding
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    
    // Check for recent visit
    const lastVisitTimestamp = localStorage.getItem('lastVisit');
    if (lastVisitTimestamp) {
      const lastVisitDate = new Date(lastVisitTimestamp);
      setLastVisit(formatDaysAgo(lastVisitDate));
      
      // Generate some random numbers for new content
      setNewDiscussions(Math.floor(Math.random() * 20) + 5);
      setNewEntries(Math.floor(Math.random() * 10) + 3);
      setNotifications(Math.floor(Math.random() * 8) + 1);
      
      setIsVisible(true);
    }
    
    // Update last visit timestamp
    localStorage.setItem('lastVisit', new Date().toISOString());
  }, []);

  const dismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !lastVisit) return null;

  return (
    <div className="bg-gradient-to-r from-[#1A1A1A] to-[#222222] rounded-lg border border-gray-800 p-6 mb-8 animate-fade-in shadow-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-900 opacity-10 rounded-full -translate-x-10 -translate-y-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-900 opacity-10 rounded-full translate-x-10 translate-y-10 blur-3xl"></div>
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">
            Welcome back{userName ? `, ${userName}` : ''}!
          </h2>
          
          <p className="text-gray-300 mt-2">
            Your last visit was {lastVisit}. Here's what you've missed:
          </p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 bg-gray-800 bg-opacity-50 rounded-lg p-3">
              <div className="p-2 rounded-full bg-[#00361F]">
                <MessageSquare size={16} className="text-[#00A67E]" />
              </div>
              <div>
                <p className="text-white font-medium">{newDiscussions}</p>
                <p className="text-xs text-gray-400">New discussions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800 bg-opacity-50 rounded-lg p-3">
              <div className="p-2 rounded-full bg-[#360036]">
                <BookOpen size={16} className="text-[#FF3EA5]" />
              </div>
              <div>
                <p className="text-white font-medium">{newEntries}</p>
                <p className="text-xs text-gray-400">New entries</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800 bg-opacity-50 rounded-lg p-3">
              <div className="p-2 rounded-full bg-[#3A3600]">
                <Bell size={16} className="text-[#FFD426]" />
              </div>
              <div>
                <p className="text-white font-medium">{notifications}</p>
                <p className="text-xs text-gray-400">Notifications</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors mr-3"
              onClick={() => {
                polymathToast.contentRecommended();
                dismiss();
              }}
            >
              Explore New Content
            </button>
            <button 
              className="text-gray-300 hover:text-white"
              onClick={() => {
                polymathToast.notificationCleared();
                dismiss();
              }}
            >
              Clear Notifications
            </button>
          </div>
        </div>
        
        <button 
          onClick={dismiss}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
