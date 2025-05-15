
import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

export interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = false, 
  className = "",
  style
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={`mb-10 ${className}`}
      style={style}
    >
      <div className="flex justify-between items-center mb-4 group">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <CollapsibleTrigger asChild>
          <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
            {isOpen ? (
              <ChevronUp size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            )}
          </button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
