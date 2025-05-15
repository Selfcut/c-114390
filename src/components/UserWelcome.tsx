
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, BookOpen, Target, ArrowRight } from 'lucide-react';
import { polymathToast } from "@/components/ui/use-toast";

interface UserWelcomeProps {
  userName?: string;
}

export function UserWelcome({ userName = "Scholar" }: UserWelcomeProps) {
  const [progress, setProgress] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading progress
    const timer = setTimeout(() => {
      setProgress(67);
    }, 500);

    // Get streak from localStorage or set default
    const streak = localStorage.getItem('userStreak');
    setStreakDays(streak ? parseInt(streak) : Math.floor(Math.random() * 10) + 1);

    // Set mock recommendations
    setRecommendations([
      "Complete your profile to personalize your experience",
      "Explore the new Discussion Forum topics",
      "Check out the Library's curated content collections"
    ]);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mb-8 animate-fade-in">
      <Card className="border-gray-800 bg-[#1A1A1A]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <Avatar className="h-20 w-20 border-2 border-[#6E59A5]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="text-xl">{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {userName}!</h2>
              <p className="text-gray-400 mb-4">
                Continue your intellectual journey. Your learning streak is currently at {streakDays} days.
              </p>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-[#6E59A5]" />
                    <span className="font-medium text-white">Weekly goal progress</span>
                  </div>
                  <span className="text-gray-300">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 p-4 bg-gray-800 rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-[#6E59A5]/20 rounded-full">
                    <Trophy size={20} className="text-[#6E59A5]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">3 badges earned</p>
                    <p className="text-gray-400 text-sm">Keep learning to earn more</p>
                  </div>
                </div>
                
                <div className="flex-1 p-4 bg-gray-800 rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-[#6E59A5]/20 rounded-full">
                    <BookOpen size={20} className="text-[#6E59A5]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">12 resources explored</p>
                    <p className="text-gray-400 text-sm">This week</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 flex-shrink-0 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-medium text-white mb-3">Recommended actions</h3>
              <ul className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm">
                    <Button 
                      variant="ghost" 
                      className="justify-start h-auto py-2 px-3 w-full text-left hover:bg-gray-700 text-gray-300 hover:text-white"
                      onClick={() => polymathToast({
                        title: "Action taken",
                        description: `You've started: ${recommendation}`,
                      })}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{recommendation}</span>
                        <ArrowRight size={14} />
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
