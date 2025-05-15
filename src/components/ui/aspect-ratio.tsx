
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"

interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  className?: string;
}

const AspectRatio = ({ className, ...props }: AspectRatioProps) => (
  <AspectRatioPrimitive.Root 
    className={cn("relative overflow-hidden rounded-md", className)} 
    {...props} 
  />
)

export { AspectRatio }
