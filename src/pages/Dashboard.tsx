import { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { UserWelcome } from "../components/UserWelcome";
import { TabNav } from "../components/TabNav";
import { useToast } from "@/hooks/use-toast";
import { Calendar, BarChart3, BookOpen, Users, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { CommunityActivity } from "@/components/dashboard/CommunityActivity";
import { RecommendationsRow } from "../components/RecommendationsRow";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Json } from "@/integrations/supabase/types";
import { getUserActivityStats } from "@/lib/utils/supabase-utils";
import { ActivityType, trackActivity } from "@/lib/activity-tracker";
import { fetchLearningProgress, extractTopicsFromActivities, createProgressDataFromTopics, addDefaultTopics } from "@/lib/utils/data-utils";

// Define interfaces for our data
interface ProgressData {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: string;
  recentActivity?: string;
  streakDays?: number;
}

interface ProfileData {
  level?: number;
  xp?: number;
  nextLevelXp?: number;
  badges?: number;
  totalBadges?: number;
  activityStreak?: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    badges: 0,
    totalBadges: 5,
    activityStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real user activities and progress from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Record dashboard view
        await trackActivity(user.id, 'view', { 
          section: 'dashboard',
          timestamp: new Date().toISOString()
        });
        
        // Fetch user activities
        const { data: activities, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (activitiesError) {
          console.error("Error fetching user activities:", activitiesError);
        }

        // Use the utility function to get user stats
        const stats = await getUserActivityStats(user.id);
        if (stats) {
          setProfileData({
            level: stats.level,
            xp: stats.xp,
            nextLevelXp: stats.nextLevelXp,
            badges: stats.badges,
            totalBadges: 5,
            activityStreak: stats.streak
          });
        }

        // Fetch user learning data
        const learningData = await fetchLearningProgress(user.id);
        
        // Get topics from activities
        const topics = extractTopicsFromActivities(learningData);

        // Get categories the user has quoted
        const { data: quoteData } = await supabase
          .from('quotes')
          .select('category')
          .eq('user_id', user.id);
        
        // Add user quote categories to topics
        if (quoteData) {
          quoteData.forEach(quote => {
            const category = quote.category;
            if (!topics.has(category)) {
              topics.set(category, { 
                activities: 1, 
                lastActivity: new Date(),
                progress: 20
              });
            } else {
              const topicData = topics.get(category)!;
              topicData.activities += 1;
              topicData.progress = Math.min(100, topicData.activities * 15);
            }
          });
        }

        // Create progress data based on topics
        let userProgressData = createProgressDataFromTopics(topics);
        
        // Ensure we have at least some progress items
        if (userProgressData.length === 0) {
          userProgressData = addDefaultTopics();
        }
        
        setProgressData(userProgressData);
      } catch (error) {
        console.error("Error in dashboard data fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, isAuthenticated]);

  // Get user name with fallback
  const userName = user?.name || user?.username || localStorage.getItem('userName') || "Scholar";

  // Badges for gamification (based on user level from activities)
  const userBadges = [
    { name: "Early Adopter", icon: "sparkles", achieved: true },
    { name: "First Post", icon: "message", achieved: true },
    { name: "Knowledge Seeker", icon: "book", achieved: profileData.level >= 2 },
    { name: "Deep Thinker", icon: "brain", achieved: profileData.level >= 3 },
    { name: "Community Builder", icon: "users", achieved: profileData.level >= 5 }
  ];
  
  // Calculate achieved badges count
  const achievedBadges = userBadges.filter(badge => badge.achieved).length;
  
  // Tabs for dashboard sections
  const dashboardTabs = [
    {
      id: "progress",
      label: "Learning Progress",
      icon: <BarChart3 size={16} className="mr-1" />,
      content: isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <Skeleton className="h-5 w-36 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full my-4" />
              <Skeleton className="h-4 w-40 mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <LearningProgress 
          progressData={progressData}
          onCardClick={(item) => {
            toast({
              title: "Learning content opened",
              description: `You opened: ${item.title}`,
            });
            
            // Record activity for opening learning content
            if (user) {
              trackActivity(user.id, 'view', { 
                topic: item.title, 
                type: 'learning' 
              });
            }
          }}
        />
      )
    },
    {
      id: "upcoming",
      label: "Upcoming Events",
      icon: <Calendar size={16} className="mr-1" />,
      content: <UpcomingEvents />
    },
    {
      id: "resources",
      label: "Latest Resources",
      icon: <BookOpen size={16} className="mr-1" />,
      content: (
        <div className="animate-fade-in">
          <RecommendationsRow />
        </div>
      )
    },
    {
      id: "community",
      label: "Community Activity",
      icon: <Users size={16} className="mr-1" />,
      content: <CommunityActivity />
    }
  ];

  return (
    <PageLayout>
      <main className="py-8 px-6 md:px-12">
        {isLoading ? (
          <div className="mb-6 p-6 border rounded-lg">
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-7 w-48 mb-3" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            <div className="flex gap-4 mt-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : (
          <UserWelcome 
            userName={userName}
            level={profileData.level || 1}
            xp={profileData.xp || 0}
            nextLevelXp={profileData.nextLevelXp || 100}
            badges={achievedBadges}
            totalBadges={userBadges.length}
            activityStreak={profileData.activityStreak || 0}
          />
        )}
        
        <TabNav tabs={dashboardTabs} defaultTab="progress" className="mb-6" />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-400" />
              Recent Activity
              <Badge className="ml-2 bg-primary/20 text-primary">New</Badge>
            </h2>
          </div>
          <ActivityFeed limit={10} />
        </div>
      </main>
    </PageLayout>
  );
};

export default Dashboard;
