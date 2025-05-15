
import { useState, useEffect } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { UserWelcome } from "../components/UserWelcome";
import { ProgressCard } from "../components/ProgressCard";
import { RecommendationsRow } from "../components/RecommendationsRow";
import { TabNav } from "../components/TabNav";
import { useToast } from "@/hooks/use-toast";
import { Calendar, BarChart3, BookOpen, Users, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { LearningProgress } from "@/components/dashboard/LearningProgress";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { CommunityActivity } from "@/components/dashboard/CommunityActivity";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const userName = user?.name || localStorage.getItem('userName') || "Scholar";
  
  // Simulated progress data
  const progressData = [
    {
      id: "1",
      title: "Systems Thinking",
      description: "Explore interconnected systems",
      progress: 45,
      icon: "brain",
      recentActivity: "Last studied: Introduction to Feedback Loops",
      streakDays: 3
    },
    {
      id: "2",
      title: "Quantum Mechanics",
      description: "Physics at the quantum scale",
      progress: 68,
      icon: "target",
      recentActivity: "Last studied: Wave-Particle Duality",
      streakDays: 5
    },
    {
      id: "3",
      title: "Mathematical Logic",
      description: "Formal systems and proofs",
      progress: 32,
      icon: "book",
      recentActivity: "Last studied: First-Order Logic"
    },
    {
      id: "4",
      title: "Philosophy of Mind",
      description: "Consciousness and cognition",
      progress: 87,
      icon: "trend",
      recentActivity: "Last studied: The Hard Problem",
      streakDays: 12
    }
  ];
  
  // Tabs for dashboard sections
  const dashboardTabs = [
    {
      id: "progress",
      label: "Learning Progress",
      icon: <BarChart3 size={16} className="mr-1" />,
      content: (
        <LearningProgress 
          progressData={progressData}
          onCardClick={(item) => toast({
            title: "Content opened",
            description: `You opened: ${item.title}`,
          })}
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

  // User activity badges (for gamification)
  const userBadges = [
    { name: "Early Adopter", icon: "sparkles", achieved: true },
    { name: "First Post", icon: "message", achieved: true },
    { name: "Knowledge Seeker", icon: "book", achieved: false },
    { name: "Deep Thinker", icon: "brain", achieved: false },
    { name: "Community Builder", icon: "users", achieved: false }
  ];

  return (
    <PageLayout>
      <main className="py-8 px-6 md:px-12">
        <UserWelcome 
          userName={userName}
          level={5}
          xp={1240}
          nextLevelXp={2000}
          badges={userBadges.filter(badge => badge.achieved).length}
          totalBadges={userBadges.length}
          activityStreak={3}
        />
        <TabNav tabs={dashboardTabs} defaultTab="progress" className="mb-6" />
        
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-400" />
              Recent Activity
              <Badge className="ml-2 bg-primary/20 text-primary">New</Badge>
            </h2>
          </div>
          <ActivityFeed />
        </div>
      </main>
    </PageLayout>
  );
};

export default Dashboard;
