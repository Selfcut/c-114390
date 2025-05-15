
import { CollapsibleSection } from "../CollapsibleSection";
import { LearningProgress } from "../LearningProgress";
import { KnowledgePathways } from "../KnowledgePathways";

export const LearningSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Learning Progress - Collapsed by Default */}
      <CollapsibleSection 
        title="Your Learning Progress" 
        defaultOpen={false} 
        className="animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <LearningProgress />
      </CollapsibleSection>
      
      {/* Knowledge Pathways - Collapsed by Default */}
      <CollapsibleSection 
        title="Knowledge Pathways" 
        defaultOpen={false} 
        className="animate-fade-in" 
        style={{ animationDelay: "0.4s" }}
      >
        <KnowledgePathways />
      </CollapsibleSection>
    </div>
  );
};
