
import { LibraryIcon, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { polymathToast } from "@/components/ui/use-toast";

interface LibraryHeaderProps {
  onCreateEntry: () => void;
}

export const LibraryHeader = ({ onCreateEntry }: LibraryHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 stagger-fade w-full">
      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
        <LibraryIcon size={28} />
        Knowledge Library
      </h1>
      <Button 
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
        onClick={onCreateEntry}
      >
        <PenSquare size={18} />
        <span>Contribute Knowledge</span>
      </Button>
    </div>
  );
};
