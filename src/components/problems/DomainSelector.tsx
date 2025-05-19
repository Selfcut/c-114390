
import React from 'react';
import { Problem } from '@/data/problemsData';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Beaker, Atom, BookOpen, Cpu } from 'lucide-react';

interface DomainSelectorProps {
  currentDomain: Problem['domain'];
  domains: Problem['domain'][];
  onDomainChange: (domain: Problem['domain']) => void;
}

const domainIcons = {
  world: <Globe className="h-4 w-4 mr-2" />,
  science: <Beaker className="h-4 w-4 mr-2" />,
  physics: <Atom className="h-4 w-4 mr-2" />,
  philosophy: <BookOpen className="h-4 w-4 mr-2" />,
  technology: <Cpu className="h-4 w-4 mr-2" />,
  health: <span className="mr-2">🩺</span>,
  social: <span className="mr-2">👥</span>,
  environment: <span className="mr-2">🌿</span>,
};

const domainLabels = {
  world: "World's Top Problems",
  science: "Science's Top Problems",
  physics: "Physics' Top Problems",
  philosophy: "Philosophy's Top Problems",
  technology: "Technology's Top Problems",
  health: "Health's Top Problems",
  social: "Social Top Problems",
  environment: "Environmental Top Problems",
};

export const DomainSelector = ({ 
  currentDomain, 
  domains, 
  onDomainChange 
}: DomainSelectorProps) => {
  // For mobile: Use a dropdown select
  const mobileSelector = (
    <div className="w-full md:hidden">
      <Select 
        value={currentDomain} 
        onValueChange={(value) => onDomainChange(value as Problem['domain'])}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select domain" />
        </SelectTrigger>
        <SelectContent>
          {domains.map((domain) => (
            <SelectItem key={domain} value={domain} className="flex items-center">
              {domainIcons[domain]}
              <span>{domainLabels[domain]}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // For desktop: Use button tabs
  const desktopSelector = (
    <div className="hidden md:flex flex-wrap gap-2">
      {domains.map((domain) => (
        <Button
          key={domain}
          variant={currentDomain === domain ? "default" : "outline"}
          size="sm"
          onClick={() => onDomainChange(domain)}
          className="flex items-center"
        >
          {domainIcons[domain]}
          {domainLabels[domain]}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="mb-6">
      {mobileSelector}
      {desktopSelector}
    </div>
  );
};
