
import { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, MessageSquare, BookOpen, Library, Plus, Bell, Search, User } from "lucide-react";
import { polymathToast } from "../components/ui/use-toast";

const Header = () => {
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const handleContribute = () => {
    polymathToast.contributionSaved();
  };
  
  const notifications = [
    {
      id: 1,
      type: "discussion",
      message: "New reply to your discussion on quantum physics",
      time: "10 minutes ago"
    },
    {
      id: 2,
      type: "mention",
      message: "You were mentioned in 'Mathematical patterns in nature'",
      time: "2 hours ago"
    },
    {
      id: 3,
      type: "system",
      message: "Welcome to Polymath! Complete your profile to connect with peers.",
      time: "1 day ago"
    }
  ];
  
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
      {/* Search Bar */}
      {searchOpen ? (
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search disciplines, discussions, knowledge base..."
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-md py-2 pl-10 pr-4 text-white"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setSearchOpen(true)} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-800"
        >
          <Search size={18} />
          <span className="text-sm">Search Polymath...</span>
        </button>
      )}
      
      <div className="flex items-center gap-4 relative">
        {/* YouTube icon */}
        <a href="#" className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800">
          <img src="/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png" alt="YouTube" className="w-6 h-6" />
        </a>
        
        {/* Discord icon */}
        <a href="#" className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800">
          <img src="/lovable-uploads/92333427-5a32-4cf8-b110-afc5b57c9f27.png" alt="Discord" className="w-6 h-6" />
        </a>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setHelpMenuOpen(false);
            }}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
              {notifications.length}
            </span>
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1e1e1e] border border-gray-800 rounded-md shadow-lg py-1 z-50">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800">
                <h3 className="text-sm font-medium text-white">Notifications</h3>
                <button className="text-xs text-blue-400 hover:text-blue-300">Mark all as read</button>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-800 border-b border-gray-800 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'discussion' ? 'bg-blue-900/30' : 
                        notification.type === 'mention' ? 'bg-green-900/30' : 'bg-gray-800'
                      }`}>
                        {notification.type === 'discussion' ? (
                          <MessageSquare size={14} className="text-blue-400" />
                        ) : notification.type === 'mention' ? (
                          <User size={14} className="text-green-400" />
                        ) : (
                          <Bell size={14} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-300">{notification.message}</p>
                        <span className="text-xs text-gray-500 mt-1">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-4 py-2 border-t border-gray-800">
                <button className="text-xs text-gray-400 hover:text-white w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Help icon with dropdown */}
        <div className="relative">
          <button 
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800" 
            onClick={() => {
              setHelpMenuOpen(!helpMenuOpen);
              setNotificationsOpen(false);
            }}
          >
            <HelpCircle size={20} />
          </button>
          
          {helpMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-gray-800 rounded-md shadow-lg py-1 z-50">
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                <MessageSquare size={16} />
                <span>Ask a Question</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                <HelpCircle size={16} />
                <span>Knowledge Base</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                <BookOpen size={16} />
                <span>Learning Guides</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                <Library size={16} />
                <span>Wiki Access</span>
              </a>
            </div>
          )}
        </div>
        
        {/* Membership button */}
        <button className="px-4 py-1.5 text-gray-300 text-sm border border-gray-700 rounded-md hover:bg-gray-800 transition-colors">
          Join Premium
        </button>
        
        {/* Contribute button */}
        <button 
          onClick={handleContribute}
          className="transition-colors text-white flex items-center gap-1 rounded-md px-4 py-1.5 text-sm font-medium bg-blue-700 hover:bg-blue-600"
        >
          <Plus size={16} />
          Contribute
        </button>
        
        {/* Sign In button */}
        <button className="px-4 py-1.5 text-gray-300 text-sm border border-gray-700 rounded-md hover:bg-gray-800 transition-colors">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Header;
