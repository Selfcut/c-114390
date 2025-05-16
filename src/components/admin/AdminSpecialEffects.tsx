
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  triggerConfetti, 
  makeItRain, 
  triggerFireEffect, 
  adminFlourish, 
  triggerStarfall,
  digitalRain,
  triggerSnowfall,
  glitchScreen,
  sparkleElement
} from "@/lib/utils/admin-effects";
import { Sparkles, Flame, CloudRain, Wand2, Stars, Sigma, Snowflake, Zap, CircuitBoard } from "lucide-react";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

export const AdminSpecialEffects = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 size={18} />
          <span>Admin Special Effects</span>
        </CardTitle>
        <CardDescription>
          Special visual effects that only admins can trigger
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <CustomTooltip content="Trigger confetti celebration" side="top">
            <Button 
              onClick={() => triggerConfetti()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Confetti</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Make it rain confetti from the top" side="top">
            <Button 
              onClick={() => makeItRain()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <CloudRain className="h-5 w-5" />
              <span>Make It Rain</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Trigger a fire effect from the bottom" side="top">
            <Button 
              onClick={() => triggerFireEffect()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Flame className="h-5 w-5" />
              <span>Fire Effect</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Trigger a subtle admin flourish" side="top">
            <Button 
              onClick={(e) => adminFlourish(e.currentTarget)} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Wand2 className="h-5 w-5" />
              <span>Admin Flourish</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Trigger a starfall effect" side="top">
            <Button 
              onClick={() => triggerStarfall()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Stars className="h-5 w-5" />
              <span>Starfall</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Matrix-like digital rain effect" side="top">
            <Button 
              onClick={() => digitalRain()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Sigma className="h-5 w-5" />
              <span>Digital Rain</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Create a snow effect on screen" side="top">
            <Button 
              onClick={() => triggerSnowfall()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Snowflake className="h-5 w-5" />
              <span>Snowfall</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Create a screen glitch effect" side="top">
            <Button 
              onClick={() => glitchScreen()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Zap className="h-5 w-5" />
              <span>Glitch Screen</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Add sparkles to a random element" side="top">
            <Button 
              onClick={() => {
                const elements = document.querySelectorAll('button, h1, h2, h3');
                const randomIndex = Math.floor(Math.random() * elements.length);
                sparkleElement(elements[randomIndex] as HTMLElement);
              }} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <CircuitBoard className="h-5 w-5" />
              <span>Random Sparkles</span>
            </Button>
          </CustomTooltip>
        </div>
      </CardContent>
    </Card>
  );
};
