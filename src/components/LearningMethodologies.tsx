
import { BookOpen } from "lucide-react";
import { polymathToast } from "./ui/use-toast";
import { ModelCard } from "./ModelCard";

export const LearningMethodologies = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModelCard 
          title="Create Your Learning Path"
          subtitle="Personalized education"
          imageSrc=""
          isTrainYourOwn={true}
        />
        <ModelCard 
          title="Feynman Technique"
          subtitle="Teaching to Learn"
          imageSrc="/lovable-uploads/22f4141e-f83e-4b85-8c93-672e181d999b.png"
          tags={[
            { label: 'Beginner', variant: 'blue' },
            { label: 'Popular', variant: 'green' }
          ]}
        />
        <ModelCard 
          title="Spaced Repetition"
          subtitle="Memory Systems"
          imageSrc="/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png"
          tags={[
            { label: 'Intermediate', variant: 'orange' },
            { label: 'Effective', variant: 'green' }
          ]}
        />
        <ModelCard 
          title="Deep Work Method"
          subtitle="Focused Learning"
          imageSrc="/lovable-uploads/e565a3ea-dc96-4344-a533-62026d4245e1.png"
          tags={[
            { label: 'Advanced', variant: 'orange' },
            { label: 'Intensive', variant: 'yellow' }
          ]}
        />
      </div>
      
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => polymathToast.searchComplete(12)}
          className="border border-gray-700 hover:bg-gray-800 transition-colors text-white flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium"
        >
          View All Methods
          <BookOpen size={16} />
        </button>
      </div>
    </>
  );
};
