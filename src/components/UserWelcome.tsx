
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Zap, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserWelcomeProps {
  userName: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  badges: number;
  totalBadges: number;
  activityStreak?: number;
  avatar?: string;
}

export const UserWelcome = ({
  userName,
  level,
  xp,
  nextLevelXp,
  badges,
  totalBadges,
  activityStreak,
  avatar
}: UserWelcomeProps) => {
  const progressPercentage = Math.min(100, Math.floor((xp / nextLevelXp) * 100));

  return (
    <Card className="mb-8 border-primary/20 overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User info section */}
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-14 w-14 border-2 border-primary">
                <AvatarImage src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Scholar"} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {userName} <span className="text-amber-400">✨</span>
                </h1>
                <p className="text-sm text-muted-foreground">Continue your learning journey</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Trophy size={16} className="text-amber-400 mr-2" />
                  <span className="font-medium">Level {level}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {xp} / {nextLevelXp} XP
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="outline" className="bg-muted/30 justify-start">
                <Award size={16} className="mr-2 text-primary" />
                <span className="mr-1">{badges}/{totalBadges}</span>
                <span className="text-muted-foreground text-sm">badges</span>
              </Button>
              
              {activityStreak && (
                <Button variant="outline" className="bg-muted/30 justify-start">
                  <Zap size={16} className="mr-2 text-amber-400" />
                  <span className="mr-1">{activityStreak}</span>
                  <span className="text-muted-foreground text-sm">day streak</span>
                </Button>
              )}
              
              <Button variant="outline" className="bg-muted/30 justify-start">
                <Star size={16} className="mr-2 text-emerald-400" />
                <span className="mr-1">5</span>
                <span className="text-muted-foreground text-sm">achievements</span>
              </Button>
            </div>
          </div>
          
          {/* Daily goals section */}
          <div className="col-span-1">
            <div className="bg-muted/30 rounded-lg p-4 h-full">
              <h3 className="font-medium mb-3">Daily Goals</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 rounded-full border-2 border-green-500 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3 text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">Read one article</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-sm">Complete daily exercise</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 rounded-full border-2 border-muted-foreground"></div>
                  <span className="text-sm">Participate in discussion</span>
                </div>
              </div>
              <Button className="w-full mt-3 bg-primary hover:bg-primary/90">
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
