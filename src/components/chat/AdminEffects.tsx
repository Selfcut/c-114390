
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Crown, Megaphone, Star, AlertTriangle, Zap } from 'lucide-react';

interface AdminEffectsProps {
  onAdminEffectSelect: (effectType: string, content?: string) => void;
}

const ADMIN_EFFECTS = [
  {
    type: 'announcement',
    label: 'Announcement',
    icon: Megaphone,
    color: 'text-blue-600',
    description: 'Important announcement'
  },
  {
    type: 'celebrate',
    label: 'Celebrate',
    icon: Star,
    color: 'text-yellow-600',
    description: 'Celebration message'
  },
  {
    type: 'warning',
    label: 'Warning',
    icon: AlertTriangle,
    color: 'text-red-600',
    description: 'Warning message'
  },
  {
    type: 'highlight',
    label: 'Highlight',
    icon: Zap,
    color: 'text-purple-600',
    description: 'Highlighted message'
  }
];

export const AdminEffects: React.FC<AdminEffectsProps> = ({ onAdminEffectSelect }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-accent hover:text-accent-foreground"
          type="button"
        >
          <Crown size={16} className="text-amber-600" />
          <span className="sr-only">Admin effects</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-3 bg-popover border-border shadow-lg" 
        align="end" 
        sideOffset={5}
        side="top"
      >
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-foreground mb-3">Admin Effects</h4>
          {ADMIN_EFFECTS.map(effect => {
            const IconComponent = effect.icon;
            return (
              <Button
                key={effect.type}
                variant="ghost"
                className="w-full justify-start h-auto p-2 hover:bg-accent hover:text-accent-foreground"
                onClick={() => onAdminEffectSelect(effect.type)}
                type="button"
              >
                <IconComponent size={16} className={`mr-2 ${effect.color}`} />
                <div className="text-left">
                  <div className="text-sm font-medium">{effect.label}</div>
                  <div className="text-xs text-muted-foreground">{effect.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
