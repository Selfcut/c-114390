
import { useEffect, useState } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { polymathToast } from "../components/ui/use-toast";
import { formatDaysAgo } from "../lib/utils";
import { WelcomeMessage } from "../components/WelcomeMessage";
import { ExploreSection } from "../components/index/ExploreSection";
import { QuoteSection } from "../components/index/QuoteSection";
import { MainContentGrid } from "../components/index/MainContentGrid";
import { SecondaryContent } from "../components/index/SecondaryContent";
import { MembershipSection } from "../components/index/MembershipSection";
import { LearningSection } from "../components/index/LearningSection";
import { DisciplinesSection } from "../components/index/DisciplinesSection";
import { FooterSection } from "../components/index/FooterSection";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [recentVisit, setRecentVisit] = useState<string | null>(null);
  const [newDiscussions, setNewDiscussions] = useState(0);
  const [newEntries, setNewEntries] = useState(0);

  // Check for recent visit
  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisit');
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - lastVisitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setRecentVisit(formatDaysAgo(lastVisitDate));
      setNewDiscussions(Math.floor(Math.random() * 20) + 5);
      setNewEntries(Math.floor(Math.random() * 10) + 3);
      
      // Show welcome back toast for returning users
      if (diffDays > 3) {
        polymathToast.welcomeBack(diffDays);
      }
    }
    
    // Update last visit timestamp
    localStorage.setItem('lastVisit', new Date().toISOString());
  }, []);

  // Add a handler to add the logo.svg file if it's missing
  useEffect(() => {
    // Check if the logo exists, if not create a simple one
    const checkLogo = async () => {
      try {
        const response = await fetch('/logo.svg');
        if (response.status === 404) {
          console.log('Logo not found, would create one in a real app');
        }
      } catch (error) {
        console.log('Error checking logo:', error);
      }
    };
    
    checkLogo();
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    polymathToast.resourceBookmarked();
  };

  return (
    <PageLayout sectionName="Dashboard" allowGuests={true}>
      <main className="py-8 px-8 lg:px-12">
        {/* Enhanced Welcome Message */}
        <WelcomeMessage />
        
        {/* Explore Section with Creation Cards */}
        <ExploreSection />
        
        {/* Enhanced Quotes Carousel */}
        <QuoteSection />

        {/* Main Content Grid */}
        <MainContentGrid />
        
        {/* Secondary Content */}
        <SecondaryContent />
        
        {/* Membership Benefits */}
        <MembershipSection />
        
        {/* Learning Progress & Pathways */}
        <LearningSection />

        {/* Disciplines, Methodologies, and Wisdom */}
        <DisciplinesSection />
        
        {/* Footer Content - Events & Search */}
        <FooterSection />
      </main>
    </PageLayout>
  );
};

export default Index;
