
import { CollapsibleSection } from "../CollapsibleSection";
import { UpcomingEvents } from "../UpcomingEvents";
import { QuickSearch } from "../QuickSearch";

export const FooterSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upcoming Events */}
      <CollapsibleSection title="Upcoming Events" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "0.9s" }}>
        <UpcomingEvents />
      </CollapsibleSection>
      
      {/* Quick Search */}
      <CollapsibleSection title="Quick Search" defaultOpen={false} className="animate-fade-in" style={{ animationDelay: "1s" }}>
        <QuickSearch />
      </CollapsibleSection>
    </div>
  );
};
