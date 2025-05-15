
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Library,
  Users,
  Settings,
  BookText,
  BookOpen,
  FileText,
  Landmark,
  Calendar,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Infinity,
  BookOpenCheck,
  Menu,
  X
} from "lucide-react";

export const MainSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    myLearning: false,
    resources: true // Resources section starts expanded
  });
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-[232px] bg-sidebar min-h-screen flex flex-col border-r border-gray-800">
      {/* Header with logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-white w-6 h-6 rounded flex items-center justify-center">
            <Infinity size={16} className="text-black" />
          </div>
          <span className="text-white font-semibold">Polymath</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>
      
      {/* Main navigation items */}
      <div className="py-2 px-3 flex flex-col gap-1">
        {/* Home */}
        <Link 
          to="/"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <Home size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Home</span>
        </Link>
        
        {/* Discussion Forum */}
        <Link 
          to="/forum"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/forum") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <MessageSquare size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Discussion Forum</span>
          <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">NEW</span>
          <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">5</span>
        </Link>
        
        {/* Knowledge Library */}
        <Link 
          to="/library"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/library") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <Library size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Knowledge Library</span>
        </Link>
        
        {/* Study Guides */}
        <Link 
          to="/study-guides"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/study-guides") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <BookOpen size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Study Guides</span>
        </Link>
        
        {/* Community */}
        <Link 
          to="/community"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/community") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <Users size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Community</span>
        </Link>
        
        {/* Discord */}
        <Link 
          to="/discord"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/discord") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <MessageSquare size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Discord</span>
        </Link>
        
        {/* Expert Q&A */}
        <Link 
          to="/expert-qa"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/expert-qa") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <MessageSquare size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Expert Q&A</span>
        </Link>
        
        {/* Disciplines */}
        <Link 
          to="/disciplines"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/disciplines") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <Landmark size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Disciplines</span>
        </Link>
        
        {/* Events */}
        <Link 
          to="/events"
          className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
            isActive("/events") ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <div className="text-gray-300">
            <Calendar size={20} />
          </div>
          <span className="text-white text-sm font-medium flex-1 text-left">Events</span>
          <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">2</span>
          <ChevronRight size={16} className="text-gray-300" />
        </Link>
      </div>
      
      {/* My Learning & Resources Sections */}
      <div className="flex-grow overflow-auto">
        {/* My Learning Section */}
        <div className="py-2 px-3">
          <button
            onClick={() => toggleSection('myLearning')}
            className="w-full flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-gray-800"
          >
            <div className="text-gray-300">
              <ChevronDown size={16} className={expandedSections.myLearning ? "transform rotate-180" : ""} />
            </div>
            <span className="text-white text-sm font-medium flex-1 text-left">My Learning</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
          
          {expandedSections.myLearning && (
            <div className="mt-1 space-y-1 animate-fade-in">
              <Link
                to="/reading-list"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <BookText size={16} />
                </div>
                <span className="text-sm text-gray-300">Reading List</span>
              </Link>
              
              <Link
                to="/study-notes"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <BookOpen size={16} />
                </div>
                <span className="text-sm text-gray-300">Study Notes</span>
              </Link>
              
              <Link
                to="/my-discussions"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <MessageSquare size={16} />
                </div>
                <span className="text-sm text-gray-300">My Discussions</span>
              </Link>
              
              <Link
                to="/study-groups"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <Users size={16} />
                </div>
                <span className="text-sm text-gray-300">Study Groups</span>
              </Link>
              
              <Link
                to="/knowledge-map"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <Library size={16} />
                </div>
                <span className="text-sm text-gray-300">Knowledge Map</span>
              </Link>
              
              <Link
                to="/learning-analytics"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <Infinity size={16} />
                </div>
                <span className="text-sm text-gray-300">Learning Analytics</span>
                <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold ml-auto">NEW</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Resources Section - Remove bg-gray-800 class to fix the blue background */}
        <div className="py-2 px-3">
          <button
            onClick={() => toggleSection('resources')}
            className="w-full flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-gray-800"
          >
            <div className="text-gray-300">
              <ChevronDown size={16} className={expandedSections.resources ? "transform rotate-180" : ""} />
            </div>
            <span className="text-white text-sm font-medium flex-1 text-left">Resources</span>
            <ChevronDown size={16} className="text-gray-300" />
          </button>
          
          {expandedSections.resources && (
            <div className="mt-1 space-y-1 animate-fade-in">
              <Link
                to="/learning-guides"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <BookOpenCheck size={16} />
                </div>
                <span className="text-sm text-gray-300">Learning Guides</span>
              </Link>
              
              <Link
                to="/wiki"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <HelpCircle size={16} />
                </div>
                <span className="text-sm text-gray-300">Wiki</span>
                <span className="ml-2 px-1 bg-muted rounded-sm text-[10px] text-gray-300">↗</span>
              </Link>
              
              <Link
                to="/help-center"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <HelpCircle size={16} />
                </div>
                <span className="text-sm text-gray-300">Help Center</span>
              </Link>
              
              <Link
                to="/new-research"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <Infinity size={16} />
                </div>
                <span className="text-sm text-gray-300">New Research</span>
                <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold ml-auto">NEW</span>
              </Link>
              
              <Link
                to="/academic-journals"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <MessageSquare size={16} />
                </div>
                <span className="text-sm text-gray-300">Academic Journals</span>
              </Link>
              
              <Link
                to="/book-reviews"
                className="w-full flex items-center gap-3 p-3 pl-12 hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="text-gray-300">
                  <BookOpen size={16} />
                </div>
                <span className="text-sm text-gray-300">Book Reviews</span>
                <span className="ml-2 px-1 bg-muted rounded-sm text-[10px] text-gray-300">↗</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* User Profile Footer */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JS</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Jane Smith</p>
            <p className="text-gray-400 text-xs">Polymath Explorer</p>
          </div>
          <Link to="/settings" className="text-gray-400 hover:text-white">
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
