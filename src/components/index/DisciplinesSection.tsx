
import { CollapsibleSection } from "../CollapsibleSection";
import { FeaturedDisciplines } from "../FeaturedDisciplines";
import { LearningMethodologies } from "../LearningMethodologies";
import { WisdomHighlights } from "../WisdomHighlights";

export const DisciplinesSection = () => {
  return (
    <div className="space-y-8 mb-12">
      {/* Featured Disciplines */}
      <CollapsibleSection title="Featured Disciplines" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <FeaturedDisciplines />
      </CollapsibleSection>
      
      {/* Learning Methodologies */}
      <CollapsibleSection title="Learning Methodologies" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <LearningMethodologies />
      </CollapsibleSection>
      
      {/* Wisdom Highlights */}
      <CollapsibleSection title="Wisdom Highlights" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
        <WisdomHighlights />
      </CollapsibleSection>
    </div>
  );
};
