
import { useState } from "react";
import { ChevronRight, HomeIcon, Users, MessageSquare, Book, BookOpen, ChevronDown, HelpCircle, Sparkles, Library, BrainCircuit, Calendar, Settings, Bell } from "lucide-react";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isNew?: boolean;
  hasDropdown?: boolean;
  badgeCount?: number;
  onClick?: () => void;
};

type DropdownItemProps = {
  icon: React.ReactNode;
  label: string;
  isExternal?: boolean;
  isActive?: boolean;
  isNew?: boolean;
  badgeCount?: number;
  onClick?: () => void;
};

const SidebarItem = ({ icon, label, isActive = false, isNew = false, hasDropdown = false, badgeCount, onClick }: SidebarItemProps) => (
  <button 
    className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'bg-accent' : 'hover:bg-accent'}`}
    onClick={onClick}
  >
    <div className={isActive ? "text-white" : "text-gray-300"}>{icon}</div>
    <span className="text-white text-sm font-medium flex-1 text-left">{label}</span>
    {isNew && (
      <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
        NEW
      </span>
    )}
    {badgeCount && badgeCount > 0 && (
      <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
        {badgeCount}
      </span>
    )}
    {hasDropdown && (
      isActive ? <ChevronDown size={16} className="text-gray-300" /> : <ChevronRight size={16} className="text-gray-300" />
    )}
  </button>
);

const DropdownItem = ({ icon, label, isExternal = false, isActive = false, isNew = false, badgeCount, onClick }: DropdownItemProps) => (
  <button 
    className={`w-full flex items-center gap-3 p-3 pl-12 hover:bg-accent rounded-md transition-colors ${isActive ? 'bg-accent' : ''}`}
    onClick={onClick}
  >
    <div className={isActive ? "text-white" : "text-gray-300"}>{icon}</div>
    <span className={`text-sm ${isActive ? "text-white" : "text-gray-300"}`}>{label}</span>
    {isNew && (
      <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold ml-auto">
        NEW
      </span>
    )}
    {badgeCount && badgeCount > 0 && (
      <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto">
        {badgeCount}
      </span>
    )}
    {isExternal && <span className="ml-2 px-1 bg-muted rounded-sm text-[10px] text-gray-300">↗</span>}
  </button>
);

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [myStuffOpen, setMyStuffOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [activeDropdownItem, setActiveDropdownItem] = useState("");
  
  // Mock notification counts
  const notificationCounts = {
    inbox: 3,
    discussions: 5,
    events: 2
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar min-h-screen flex flex-col items-center py-4 border-r border-gray-800">
        <div className="mb-8">
          <img src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" alt="Logo" className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-4">
          <button className="p-2 rounded-md hover:bg-accent" title="Home">
            <HomeIcon size={20} className="text-gray-300" />
          </button>
          <button className="p-2 rounded-md hover:bg-accent" title="Discussion Forum">
            <MessageSquare size={20} className="text-gray-300" />
            <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-1 py-0.5 rounded-full">
              {notificationCounts.discussions}
            </span>
          </button>
          <button className="p-2 rounded-md hover:bg-accent" title="Knowledge Library">
            <Library size={20} className="text-gray-300" />
          </button>
          <button className="p-2 rounded-md hover:bg-accent" title="Events">
            <Calendar size={20} className="text-gray-300" />
            <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-1 py-0.5 rounded-full">
              {notificationCounts.events}
            </span>
          </button>
          <button className="p-2 rounded-md hover:bg-accent" title="Notifications">
            <Bell size={20} className="text-gray-300" />
          </button>
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 rounded-full p-1 text-white hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[232px] bg-sidebar min-h-screen flex flex-col border-r border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" alt="Logo" className="w-8 h-8" />
          <span className="text-white font-semibold">Polymath</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="py-2 px-3 flex flex-col gap-1">
        <SidebarItem 
          icon={<HomeIcon size={20} />} 
          label="Home" 
          isActive={activeItem === "Home"}
          onClick={() => setActiveItem("Home")}
        />
        <SidebarItem 
          icon={<MessageSquare size={20} />} 
          label="Discussion Forum" 
          isNew 
          badgeCount={notificationCounts.discussions}
          isActive={activeItem === "Discussion Forum"}
          onClick={() => setActiveItem("Discussion Forum")}
        />
        <SidebarItem 
          icon={<Library size={20} />} 
          label="Knowledge Library" 
          isActive={activeItem === "Knowledge Library"}
          onClick={() => setActiveItem("Knowledge Library")}
        />
        <SidebarItem 
          icon={<Book size={20} />} 
          label="Study Guides" 
          isActive={activeItem === "Study Guides"}
          onClick={() => setActiveItem("Study Guides")}
        />
        <SidebarItem 
          icon={<Users size={20} />} 
          label="Community" 
          isActive={activeItem === "Community"}
          onClick={() => setActiveItem("Community")}
        />
        <SidebarItem 
          icon={<MessageSquare size={20} />} 
          label="Discord" 
          isActive={activeItem === "Discord"}
          onClick={() => setActiveItem("Discord")}
        />
        <SidebarItem 
          icon={<MessageSquare size={20} />} 
          label="Expert Q&A" 
          isActive={activeItem === "Expert Q&A"}
          onClick={() => setActiveItem("Expert Q&A")}
        />
        <SidebarItem 
          icon={<BookOpen size={20} />} 
          label="Disciplines" 
          isActive={activeItem === "Disciplines"}
          onClick={() => setActiveItem("Disciplines")}
        />
        <SidebarItem 
          icon={<Calendar size={20} />} 
          label="Events" 
          hasDropdown
          badgeCount={notificationCounts.events}
          isActive={activeItem === "Events" || eventsOpen}
          onClick={() => {
            setEventsOpen(!eventsOpen);
            setActiveItem("Events");
          }}
        />
        
        {eventsOpen && (
          <div className="mt-1 space-y-1 animate-fade-in">
            <DropdownItem 
              icon={<Calendar size={16} />} 
              label="Upcoming Events" 
              isNew 
              isActive={activeDropdownItem === "Upcoming Events"}
              onClick={() => setActiveDropdownItem("Upcoming Events")}
            />
            <DropdownItem 
              icon={<Users size={16} />} 
              label="Workshops" 
              isActive={activeDropdownItem === "Workshops"}
              onClick={() => setActiveDropdownItem("Workshops")}
            />
            <DropdownItem 
              icon={<BookOpen size={16} />} 
              label="Reading Groups" 
              isActive={activeDropdownItem === "Reading Groups"}
              badgeCount={2}
              onClick={() => setActiveDropdownItem("Reading Groups")}
            />
          </div>
        )}
      </div>

      <div className="flex-grow overflow-auto">
        <div className="py-2 px-3">
          <SidebarItem 
            icon={myStuffOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            label="My Learning" 
            isActive={activeItem === "My Learning"}
            hasDropdown
            onClick={() => {
              setMyStuffOpen(!myStuffOpen);
              setActiveItem("My Learning");
            }}
          />

          {myStuffOpen && (
            <div className="mt-1 space-y-1 animate-fade-in">
              <DropdownItem 
                icon={<Book size={16} />} 
                label="Reading List" 
                isActive={activeDropdownItem === "Reading List"}
                onClick={() => setActiveDropdownItem("Reading List")}
              />
              <DropdownItem 
                icon={<BookOpen size={16} />} 
                label="Study Notes" 
                isActive={activeDropdownItem === "Study Notes"}
                onClick={() => setActiveDropdownItem("Study Notes")}
              />
              <DropdownItem 
                icon={<MessageSquare size={16} />} 
                label="My Discussions" 
                isActive={activeDropdownItem === "My Discussions"}
                onClick={() => setActiveDropdownItem("My Discussions")}
              />
              <DropdownItem 
                icon={<Users size={16} />} 
                label="Study Groups" 
                isActive={activeDropdownItem === "Study Groups"}
                onClick={() => setActiveDropdownItem("Study Groups")}
              />
              <DropdownItem 
                icon={<Library size={16} />} 
                label="Knowledge Map" 
                isActive={activeDropdownItem === "Knowledge Map"}
                onClick={() => setActiveDropdownItem("Knowledge Map")}
              />
              <DropdownItem 
                icon={<BrainCircuit size={16} />} 
                label="Learning Analytics" 
                isNew
                isActive={activeDropdownItem === "Learning Analytics"}
                onClick={() => setActiveDropdownItem("Learning Analytics")}
              />
            </div>
          )}
        </div>

        <div className="py-2 px-3">
          <SidebarItem 
            icon={resourcesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            label="Resources" 
            hasDropdown
            isActive={activeItem === "Resources"}
            onClick={() => {
              setResourcesOpen(!resourcesOpen);
              setActiveItem("Resources");
            }}
          />
          
          {resourcesOpen && (
            <div className="mt-1 space-y-1 animate-fade-in">
              <DropdownItem 
                icon={<BookOpen size={16} />} 
                label="Learning Guides" 
                isActive={activeDropdownItem === "Learning Guides"}
                onClick={() => setActiveDropdownItem("Learning Guides")}
              />
              <DropdownItem 
                icon={<HelpCircle size={16} />} 
                label="Wiki" 
                isExternal 
                isActive={activeDropdownItem === "Wiki"}
                onClick={() => setActiveDropdownItem("Wiki")}
              />
              <DropdownItem 
                icon={<HelpCircle size={16} />} 
                label="Help Center" 
                isActive={activeDropdownItem === "Help Center"}
                onClick={() => setActiveDropdownItem("Help Center")}
              />
              <DropdownItem 
                icon={<Sparkles size={16} />} 
                label="New Research" 
                isNew
                isActive={activeDropdownItem === "New Research"}
                onClick={() => setActiveDropdownItem("New Research")}
              />
              <DropdownItem 
                icon={<MessageSquare size={16} />} 
                label="Academic Journals" 
                isActive={activeDropdownItem === "Academic Journals"}
                onClick={() => setActiveDropdownItem("Academic Journals")}
              />
              <DropdownItem 
                icon={<BookOpen size={16} />} 
                label="Book Reviews" 
                isExternal 
                isActive={activeDropdownItem === "Academic Journals"}
                onClick={() => setActiveDropdownItem("Book Reviews")}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JS</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Jane Smith</p>
            <p className="text-gray-400 text-xs">Polymath Explorer</p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

