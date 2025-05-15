
import { Check } from "lucide-react";

const benefits = [
  "Access to our authentic collection",
  "Join discussions with like-minded individuals", 
  "Share your own insights and discoveries",
  "Participate in regular community events"
];

export const MembershipBenefits = () => {
  return (
    <section className="mb-12 animate-fade-in">
      <div className="bg-[#1A1A1A] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Join Our Community
        </h2>
        
        <p className="text-gray-300 mb-6">
          We're a gathering of seekers dedicated to preserving and discussing the knowledge that mainstream institutions often overlook.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-[#6E59A5]">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => console.log("Join community clicked")} 
            className="bg-[#6E59A5] hover:bg-[#7E69AB] text-white px-6 py-2 rounded-md transition-colors button-hover-effect"
          >
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
};
