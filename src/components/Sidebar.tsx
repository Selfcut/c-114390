
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
  Calendar,
  BookOpen
} from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      title: 'Home',
      icon: <Home size={20} />,
      path: '/',
    },
    {
      title: 'Discussion Forum',
      icon: <MessageSquare size={20} />,
      path: '/forum',
      badge: { text: 'NEW', color: 'bg-green-500', count: 5 }
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
      icon: <BookText size={20} />,
      path: '/disciplines',
    },
    {
      title: 'Events',
      icon: <Calendar size={20} />,
      path: '/events',
      badge: { count: 2 },
      hasSubmenu: true
    },
    {
      title: 'My Learning',
      icon: <BookOpen size={20} />,
      path: '/my-learning',
      hasSubmenu: true
    },
    {
      title: 'Resources',
      icon: <BookText size={20} />,
      path: '/resources',
      hasSubmenu: true
    },
  ];

  return (
    <div 
      className={`bg-[#121212] flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 border-r border-gray-800`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 border border-gray-700">
              <span className="text-white text-xl">∞</span>
            </div>
            <h2 className="text-xl font-bold text-white">Polymath</h2>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`${
            collapsed ? 'mx-auto' : ''
          } p-1.5 rounded-md bg-gray-800 text-gray-400 hover:text-white transition-colors`}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center ${
                collapsed ? 'justify-center' : 'justify-between'
              } px-3 py-3 rounded-md group ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <span className="w-5 h-5">{item.icon}</span>
                {!collapsed && (
                  <span className="ml-3 font-medium">{item.title}</span>
                )}
              </div>
              
              {!collapsed && item.badge && (
                <div className="flex items-center gap-1">
                  {item.badge.text && (
                    <span className={`px-1.5 py-0.5 text-xs text-white rounded ${item.badge.color || 'bg-green-500'}`}>
                      {item.badge.text}
                    </span>
                  )}
                  {item.badge.count && (
                    <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-500 rounded-full">
                      {item.badge.count}
                    </span>
                  )}
                </div>
              )}
              
              {!collapsed && item.hasSubmenu && (
                <span className="text-gray-500">›</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        {!collapsed ? (
          <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
            <div className="font-medium text-white mb-1">Pro Tip</div>
            <p>Press <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">⌘</kbd> + <kbd className="bg-gray-700 px-1.5 py-0.5 rounded">K</kbd> to search</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <BookText size={20} className="text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};
