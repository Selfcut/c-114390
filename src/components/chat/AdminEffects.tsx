
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquarePlus } from 'lucide-react';

interface AdminEffectsProps {
  onEffectSelect: (effectType: string, content?: string) => void;
  isAdmin: boolean;
}

// List of available admin effects
const ADMIN_EFFECTS = [
  { name: 'Announcement', type: 'announcement', description: 'Send an important announcement to all users' },
  { name: 'System Alert', type: 'system-alert', description: 'Display a system-wide alert message' },
  { name: 'Pinned Message', type: 'pin', description: 'Pin an important message to the top' },
  { name: 'Confetti', type: 'confetti', description: 'Trigger a confetti animation for celebration' },
  { name: 'Shake', type: 'shake', description: 'Make the chat window shake briefly' },
  { name: 'Rainbow', type: 'rainbow', description: 'Apply rainbow text effect to your message' },
  { name: 'Highlight', type: 'highlight', description: 'Highlight your message with glow effect' }
];

export const AdminEffects = ({ onEffectSelect, isAdmin }: AdminEffectsProps) => {
  // Only render if user is an admin
  if (!isAdmin) return null;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7 rounded-full"
          title="Admin Effects"
        >
          <MessageSquarePlus size={16} />
          <span className="sr-only">Admin Effects</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="end" alignOffset={-40}>
        <div className="space-y-2">
          <h4 className="text-sm font-medium mb-2">Admin Effects</h4>
          <div className="grid gap-2">
            {ADMIN_EFFECTS.map((effect) => (
              <Button
                key={effect.type}
                variant="outline"
                className="justify-start text-left h-auto py-2 px-3"
                onClick={() => onEffectSelect(effect.type)}
              >
                <div>
                  <span className="font-medium">{effect.name}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{effect.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
