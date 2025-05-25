
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sparkles } from 'lucide-react';

interface AdminEffectsProps {
  onAdminEffectSelect: (effectType: string, content?: string) => void;
}

export const AdminEffects = ({ onAdminEffectSelect }: AdminEffectsProps) => {
  const effects = [
    { id: 'announcement', label: 'Announcement', icon: '📢' },
    { id: 'celebrate', label: 'Celebrate', icon: '🎉' },
    { id: 'warning', label: 'Warning', icon: '⚠️' },
    { id: 'highlight', label: 'Highlight', icon: '✨' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-accent hover:text-accent-foreground"
          type="button"
        >
          <Sparkles size={16} />
          <span className="sr-only">Admin effects</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48 bg-popover border-border shadow-lg" 
        align="end" 
        sideOffset={5}
      >
        {effects.map(effect => (
          <DropdownMenuItem
            key={effect.id}
            onClick={() => onAdminEffectSelect(effect.id)}
            className="flex items-center gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
          >
            <span>{effect.icon}</span>
            <span>{effect.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
