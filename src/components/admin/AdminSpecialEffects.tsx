
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  triggerConfetti, 
  makeItRain, 
  triggerFireEffect, 
  adminFlourish, 
  triggerStarfall,
  digitalRain
} from "@/lib/utils/admin-effects";
import { Sparkles, Flame, CloudRain, Wand2, Stars, Sigma } from "lucide-react";
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
          <CustomTooltip content="Trigger confetti celebration">
            <Button 
              onClick={() => triggerConfetti()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Confetti</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Make it rain confetti from the top">
            <Button 
              onClick={() => makeItRain()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <CloudRain className="h-5 w-5" />
              <span>Make It Rain</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Trigger a fire effect from the bottom">
            <Button 
              onClick={() => triggerFireEffect()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Flame className="h-5 w-5" />
              <span>Fire Effect</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Trigger a subtle admin flourish">
            <Button 
              onClick={(e) => adminFlourish(e.currentTarget)} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Wand2 className="h-5 w-5" />
              <span>Admin Flourish</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Trigger a starfall effect">
            <Button 
              onClick={() => triggerStarfall()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Stars className="h-5 w-5" />
              <span>Starfall</span>
            </Button>
          </CustomTooltip>
          
          <CustomTooltip content="Matrix-like digital rain effect">
            <Button 
              onClick={() => digitalRain()} 
              variant="outline" 
              className="flex flex-col items-center justify-center h-24 gap-2"
            >
              <Sigma className="h-5 w-5" />
              <span>Digital Rain</span>
            </Button>
          </CustomTooltip>
        </div>
      </CardContent>
    </Card>
  );
};
