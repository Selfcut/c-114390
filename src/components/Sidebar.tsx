
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  Library,
  Users,
  Settings,
  Menu,
  X,
  BookText,
  Quote,
  BookOpen,
  FileText,
  Landmark,
  Calendar,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Infinity,
  BadgeInfo,
  BookOpenCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    myLearning: false,
    resources: false
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

  // Main navigation items
  const mainNavItems = [
    {
      title: 'Home',
      icon: <Home size={20} />,
      path: '/',
    },
    {
      title: 'Discussion Forum',
      icon: <MessageSquare size={20} />,
      path: '/forum',
      badge: { type: 'new', content: 'NEW' },
      count: 5
    },
    {
      title: 'Knowledge Library',
      icon: <Library size={20} />,
      path: '/library',
    },
    {
      title: 'Study Guides',
      icon: <BookOpen size={20} />,
      path: '/study-guides',
    },
    {
      title: 'Community',
      icon: <Users size={20} />,
      path: '/community',
    },
    {
      title: 'Discord',
      icon: <MessageSquare size={20} />,
      path: '/discord',
    },
    {
      title: 'Expert Q&A',
      icon: <MessageSquare size={20} />,
      path: '/expert-qa',
    },
    {
      title: 'Disciplines',
      icon: <Landmark size={20} />,
      path: '/disciplines',
    },
    {
      title: 'Events',
      icon: <Calendar size={20} />,
      path: '/events',
      count: 2,
      hasSubmenu: true
    },
  ];

  // My Learning submenu items
  const myLearningItems = [
    {
      title: 'Reading List',
      icon: <FileText size={16} />,
      path: '/reading-list',
    },
    {
      title: 'Study Notes',
      icon: <BookText size={16} />,
      path: '/study-notes',
    },
    {
      title: 'My Discussions',
      icon: <MessageSquare size={16} />,
      path: '/my-discussions',
    },
    {
      title: 'Study Groups',
      icon: <Users size={16} />,
      path: '/study-groups',
    },
    {
      title: 'Knowledge Map',
      icon: <Library size={16} />,
      path: '/knowledge-map',
    },
    {
      title: 'Learning Analytics',
      icon: <Infinity size={16} />,
      path: '/learning-analytics',
      badge: { type: 'new', content: 'NEW' }
    },
  ];

  // Resources submenu items
  const resourcesItems = [
    {
      title: 'Learning Guides',
      icon: <BookOpenCheck size={16} />,
      path: '/learning-guides',
    },
    {
      title: 'Wiki',
      icon: <HelpCircle size={16} />,
      path: '/wiki',
      hasEditIcon: true
    },
    {
      title: 'Help Center',
      icon: <HelpCircle size={16} />,
      path: '/help-center',
    },
    {
      title: 'New Research',
      icon: <Infinity size={16} />,
      path: '/new-research',
      badge: { type: 'new', content: 'NEW' }
    },
    {
      title: 'Academic Journals',
      icon: <MessageSquare size={16} />,
      path: '/academic-journals',
    },
    {
      title: 'Book Reviews',
      icon: <BookText size={16} />,
      path: '/book-reviews',
      hasEditIcon: true
    },
  ];

  return (
    <div 
      className={`bg-[#1A1A1A] flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="bg-white w-6 h-6 rounded flex items-center justify-center">
              <Infinity size={16} className="text-black" />
            </div>
            <h2 className="text-xl font-bold text-white">Polymath</h2>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`${
            collapsed ? 'mx-auto' : ''
          } p-1.5 rounded-md bg-gray-800 text-white hover:text-white transition-colors`}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-2">
          {/* Main Navigation Items */}
          {mainNavItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center ${
                collapsed ? 'justify-center' : 'justify-between'
              } px-3 py-2 rounded-md group ${
                isActive(item.path)
                  ? 'bg-gray-800 text-white'
                  : 'text-white hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 h-5">{item.icon}</span>
                {!collapsed && (
                  <span className="ml-3 text-sm">{item.title}</span>
                )}
              </div>
              
              {!collapsed && (
                <div className="flex items-center space-x-1">
                  {item.badge && (
                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                      {item.badge.content}
                    </span>
                  )}
                  {item.count && (
                    <span className="bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {item.count}
                    </span>
                  )}
                  {item.hasSubmenu && <ChevronRight size={16} />}
                </div>
              )}
            </Link>
          ))}

          {/* My Learning Section */}
          <div>
            <button
              onClick={() => toggleSection('myLearning')}
              className={`flex items-center ${
                collapsed ? 'justify-center' : 'justify-between'
              } w-full px-3 py-2 rounded-md text-white hover:bg-gray-800`}
            >
              <div className="flex items-center">
                {!collapsed && (
                  <span className="text-sm">My Learning</span>
                )}
              </div>
              {!collapsed && (
                <ChevronDown size={16} className={expandedSections.myLearning ? 'transform rotate-180' : ''} />
              )}
            </button>
            
            {!collapsed && expandedSections.myLearning && (
              <div className="ml-2 space-y-1 mt-1">
                {myLearningItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={`flex items-center justify-between pl-6 pr-3 py-1.5 rounded-md ${
                      isActive(item.path)
                        ? 'bg-gray-800 text-white'
                        : 'text-white hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-4 h-4">{item.icon}</span>
                      <span className="ml-2 text-xs">{item.title}</span>
                    </div>
                    
                    {item.badge && (
                      <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                        {item.badge.content}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Resources Section - Removing the bg-gray-900 class that was making it blue */}
          <div className="rounded-md">
            <button
              onClick={() => toggleSection('resources')}
              className={`flex items-center ${
                collapsed ? 'justify-center' : 'justify-between'
              } w-full px-3 py-2 rounded-md text-white hover:bg-gray-800`}
            >
              <div className="flex items-center">
                {!collapsed && (
                  <span className="text-sm">Resources</span>
                )}
              </div>
              {!collapsed && (
                <ChevronDown size={16} className={expandedSections.resources ? 'transform rotate-180' : ''} />
              )}
            </button>
            
            {!collapsed && expandedSections.resources && (
              <div className="ml-2 space-y-1 mt-1">
                {resourcesItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className={`flex items-center justify-between pl-6 pr-3 py-1.5 rounded-md ${
                      isActive(item.path)
                        ? 'bg-gray-800 text-white'
                        : 'text-white hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-4 h-4">{item.icon}</span>
                      <span className="ml-2 text-xs">{item.title}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {item.badge && (
                        <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                          {item.badge.content}
                        </span>
                      )}
                      {item.hasEditIcon && (
                        <span className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="p-4">
        {!collapsed ? (
          <div className="bg-gray-800 rounded-lg p-3 text-sm text-white">
            <div className="font-medium text-white mb-1">Pro Tip</div>
            <p>Press <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">⌘</kbd> + <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">K</kbd> to search</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <BookText size={20} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};
