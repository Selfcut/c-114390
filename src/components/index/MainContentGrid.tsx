
import { CollapsibleSection } from "../CollapsibleSection";
import { MysticalTopicsSection } from "../MysticalTopicsSection";
import { EnhancedKnowledgeExplorer } from "../EnhancedKnowledgeExplorer";
import { TopicRecommendations } from "../TopicRecommendations";
import { ContentProgressTracker } from "../ContentProgressTracker";
import { EnhancedCommunityActivity } from "../EnhancedCommunityActivity";
import { FeaturedBooksSection } from "../FeaturedBooksSection";

export const MainContentGrid = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Topic Recommendations */}
        <TopicRecommendations />
        
        {/* Knowledge Explorer - Enhanced */}
        <CollapsibleSection title="Explore Knowledge" defaultOpen={true}>
          <EnhancedKnowledgeExplorer />
        </CollapsibleSection>
        
        {/* Mystical Topics with hover effects */}
        <CollapsibleSection title="Mystical Topics" defaultOpen={true}>
          <MysticalTopicsSection />
        </CollapsibleSection>
      </div>
      
      {/* Right Column */}
      <div className="space-y-8">
        {/* Content Progress Tracker */}
        <ContentProgressTracker />
        
        {/* Community Activity Feed */}
        <EnhancedCommunityActivity />
        
        {/* Featured Books */}
        <CollapsibleSection title="Featured Books" defaultOpen={true}>
          <FeaturedBooksSection />
        </CollapsibleSection>
      </div>
    </div>
  );
};
