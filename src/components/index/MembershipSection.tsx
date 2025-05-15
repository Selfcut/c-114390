
import { CollapsibleSection } from "../CollapsibleSection";
import { MembershipBenefits } from "../MembershipBenefits";

export const MembershipSection = () => {
  return (
    <CollapsibleSection title="Membership Benefits" defaultOpen={true}>
      <MembershipBenefits />
    </CollapsibleSection>
  );
};
