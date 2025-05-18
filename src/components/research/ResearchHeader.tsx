
import React from 'react';
import { Button } from "@/components/ui/button";
import { Microscope, Plus } from "lucide-react";

interface ResearchHeaderProps {
  onCreateResearch: () => void;
}

export const ResearchHeader = ({ onCreateResearch }: ResearchHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Microscope className="h-8 w-8 text-primary" />
        Research Papers
      </h1>
      <p className="text-muted-foreground">
        Explore groundbreaking research papers from our scientific community.
      </p>
      <div className="flex mt-2">
        <Button onClick={onCreateResearch} className="flex items-center gap-2">
          <Plus size={16} />
          Add Research Paper
        </Button>
      </div>
    </div>
  );
};
