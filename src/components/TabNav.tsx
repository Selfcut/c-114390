
import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TabProps {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabNavProps {
  tabs: TabProps[];
  defaultTab?: string;
  className?: string;
}

export function TabNav({ tabs, defaultTab, className }: TabNavProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || (tabs.length > 0 ? tabs[0].id : ''));

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex border-b border-gray-800 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none border-b-2 border-transparent transition-colors",
              activeTab === tab.id 
                ? "border-[#6E59A5] text-white"
                : "text-gray-400 hover:text-white hover:border-gray-700"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>
      
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          className={cn(
            "animate-fade-in",
            activeTab !== tab.id && "hidden"
          )}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
