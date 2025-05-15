
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
}

export const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
  className = "",
  titleClassName = ""
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`mb-8 bg-[#1A1A1A] rounded-lg p-6 border border-gray-800 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold text-white ${titleClassName}`}>{title}</h2>
        <CollapsibleTrigger asChild>
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label={isOpen ? "Collapse section" : "Expand section"}
          >
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4 space-y-4 overflow-hidden">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
