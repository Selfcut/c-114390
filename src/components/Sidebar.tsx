
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  MessageSquare,
  Library,
  Users,
  Settings,
  Menu,
  X,
  Quote,
  BookText
} from 'lucide-react';

// Update these with your icon imports (make sure they exist)
// import IconHome from '../assets/icons/icon-home.svg';
// import IconForum from '../assets/icons/icon-forum.svg';

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
      title: 'Forum',
      icon: <MessageSquare size={20} />,
      path: '/forum',
    },
    {
      title: 'Library',
      icon: <Library size={20} />,
      path: '/library',
    },
    {
      title: 'Quotes',
      icon: <Quote size={20} />,
      path: '/quotes',
    },
    {
      title: 'Community',
      icon: <Users size={20} />,
      path: '/community',
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
    }
  ];

  return (
    <div 
      className={`bg-[#121212] flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300 border-r border-gray-800`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h2 className="text-xl font-bold text-white">Polymath</h2>
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
                collapsed ? 'justify-center' : 'justify-start'
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
