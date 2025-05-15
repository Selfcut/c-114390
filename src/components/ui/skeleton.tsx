
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted skeleton-pulse", className)}
      {...props}
    />
  )
}

function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

function SkeletonText({
  className,
  lines = 3,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div 
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {Array(lines).fill(null).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonText }
