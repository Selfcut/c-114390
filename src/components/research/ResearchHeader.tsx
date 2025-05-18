
import React from 'react';
import { FilePenLine, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResearchHeaderProps {
  onCreateResearch: () => void;
}

export const ResearchHeader = ({ onCreateResearch }: ResearchHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 stagger-fade w-full">
      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
        <Microscope size={28} />
        Research
      </h1>
      <Button 
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover-lift"
        onClick={onCreateResearch}
      >
        <FilePenLine size={18} />
        <span>New Research</span>
      </Button>
    </div>
  );
};
