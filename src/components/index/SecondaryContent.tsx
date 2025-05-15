
import { CollapsibleSection } from "../CollapsibleSection";
import { ReadingList } from "../ReadingProgress";
import { CommunitySection } from "../CommunitySection";
import { useIsMobile } from "../../hooks/use-mobile";

export const SecondaryContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Reading Progress */}
      <CollapsibleSection title="Reading Progress" defaultOpen={!isMobile}>
        <ReadingList />
      </CollapsibleSection>
      
      {/* Community Section */}
      <CollapsibleSection title="Community" defaultOpen={!isMobile}>
        <CommunitySection />
      </CollapsibleSection>
    </div>
  );
};
