
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"

interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  className?: string;
  hoverEffect?: boolean;
  animationDelay?: string;
}

const AspectRatio = ({ 
  className, 
  hoverEffect = false,
  animationDelay,
  ...props 
}: AspectRatioProps) => (
  <AspectRatioPrimitive.Root 
    className={cn(
      "relative overflow-hidden rounded-md", 
      hoverEffect && "transition-all duration-300 transform hover:scale-[1.02]",
      animationDelay && "animate-fade-in",
      className
    )} 
    style={animationDelay ? { animationDelay } : undefined} 
    {...props} 
  />
)

export { AspectRatio }
