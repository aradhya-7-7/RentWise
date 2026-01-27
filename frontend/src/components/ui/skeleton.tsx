import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        // Base look (more premium than flat bg-muted)
        "relative overflow-hidden rounded-md border border-border",
        "bg-gradient-to-br from-muted/80 via-muted/50 to-muted/80",

        // Soft pulse for depth
        "animate-pulse",

        // Shimmer layer 1 (wide)
        "before:absolute before:inset-0",
        "before:-translate-x-full before:animate-skeletonShimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",

        // Shimmer layer 2 (thin sharper streak, delayed)
        "after:absolute after:inset-0",
        "after:-translate-x-full after:animate-skeletonShimmer2",
        "after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent",

        className
      )}
    />
  )
}
