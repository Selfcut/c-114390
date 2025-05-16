
import { Button } from "@/components/ui/button";

export const LearningPathRecommendations = () => {
  return (
    <div className="mt-8 bg-card rounded-lg p-6 border border-border w-full">
      <h2 className="text-lg font-semibold text-foreground mb-4">Recommended Learning Paths</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-fade w-full">
        <div className="bg-muted p-4 rounded-lg hover-lift cursor-pointer w-full">
          <h3 className="text-foreground font-medium">Foundations of Systems Thinking</h3>
          <p className="text-sm text-muted-foreground mt-1">5 modules • 3 hours total</p>
          <Button className="mt-3 w-full bg-primary hover:bg-primary/90 text-white text-sm py-1.5 rounded transition-colors">
            Begin Path
          </Button>
        </div>
        <div className="bg-muted p-4 rounded-lg hover-lift cursor-pointer w-full">
          <h3 className="text-foreground font-medium">Philosophy of Science</h3>
          <p className="text-sm text-muted-foreground mt-1">8 modules • 6 hours total</p>
          <Button className="mt-3 w-full bg-primary hover:bg-primary/90 text-white text-sm py-1.5 rounded transition-colors">
            Begin Path
          </Button>
        </div>
        <div className="bg-muted p-4 rounded-lg hover-lift cursor-pointer w-full">
          <h3 className="text-foreground font-medium">Mathematical Thinking</h3>
          <p className="text-sm text-muted-foreground mt-1">6 modules • 4 hours total</p>
          <Button className="mt-3 w-full bg-primary hover:bg-primary/90 text-white text-sm py-1.5 rounded transition-colors">
            Begin Path
          </Button>
        </div>
      </div>
    </div>
  );
};
