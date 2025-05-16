
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Star, Trophy, Zap, BookOpen, MessageSquare, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileBadgesProps {
  userId: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  achieved: boolean;
  date_achieved?: string;
}

export const ProfileBadges = ({ userId }: ProfileBadgesProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('user_activities')
          .select('event_type, created_at')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        setActivities(data || []);
      } catch (err) {
        console.error("Error fetching user activities for badges:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserActivities();
  }, [userId]);

  // Generate badges based on user activities
  const getBadges = (): Badge[] => {
    // Count activities by type
    const activityCounts = activities.reduce((acc, activity) => {
      const { event_type } = activity;
      acc[event_type] = (acc[event_type] || 0) + 1;
      return acc;
    }, {});

    // Define badges
    const badges: Badge[] = [
      {
        id: "welcome",
        name: "Welcome",
        description: "Joined the Polymath platform",
        icon: <Star className="h-6 w-6 text-amber-500" />,
        achieved: true,
        date_achieved: activities[0]?.created_at
      },
      {
        id: "reader",
        name: "Avid Reader",
        description: "Viewed at least 10 different resources",
        icon: <BookOpen className="h-6 w-6 text-blue-500" />,
        achieved: (activityCounts["view"] || 0) >= 10
      },
      {
        id: "contributor",
        name: "Contributor",
        description: "Created at least 5 pieces of content",
        icon: <Award className="h-6 w-6 text-purple-500" />,
        achieved: (activityCounts["create"] || 0) >= 5
      },
      {
        id: "commenter",
        name: "Commenter",
        description: "Left at least 10 comments",
        icon: <MessageSquare className="h-6 w-6 text-green-500" />,
        achieved: (activityCounts["comment"] || 0) >= 10
      },
      {
        id: "supporter",
        name: "Supporter",
        description: "Liked at least 15 pieces of content",
        icon: <ThumbsUp className="h-6 w-6 text-pink-500" />,
        achieved: (activityCounts["like"] || 0) >= 15
      },
      {
        id: "power-user",
        name: "Power User",
        description: "Performed at least 50 actions on the platform",
        icon: <Zap className="h-6 w-6 text-yellow-500" />,
        achieved: activities.length >= 50
      },
      {
        id: "expert",
        name: "Subject Expert",
        description: "Recognized for expertise in a specific area",
        icon: <Trophy className="h-6 w-6 text-amber-600" />,
        achieved: false
      }
    ];

    return badges;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <Skeleton className="h-16 w-16 rounded-full mb-3" />
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const badges = getBadges();
  const achievedBadges = badges.filter(b => b.achieved);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Badges</CardTitle>
        <div className="text-sm text-muted-foreground">
          {achievedBadges.length} of {badges.length} earned
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map(badge => (
            <div 
              key={badge.id} 
              className={`border rounded-lg p-4 flex flex-col items-center justify-center text-center ${
                badge.achieved 
                  ? 'border-primary/30 bg-primary/5' 
                  : 'border-muted-foreground/20 bg-muted/30 opacity-60'
              }`}
            >
              <div className={`p-3 rounded-full mb-3 ${
                badge.achieved ? 'bg-primary/10' : 'bg-muted'
              }`}>
                {badge.icon}
              </div>
              <h3 className="font-semibold">{badge.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              {badge.achieved && badge.date_achieved && (
                <p className="text-xs text-primary mt-2">
                  Earned {new Date(badge.date_achieved).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
