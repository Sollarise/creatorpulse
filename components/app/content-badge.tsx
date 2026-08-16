import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const LABELS: Record<string, string> = { video: "Video", short: "Short", live: "Live" }

export function ContentBadge({ type }: { type: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-normal",
        type === "short" && "bg-accent/15 text-accent",
        type === "live" && "bg-destructive/15 text-destructive",
      )}
    >
      {LABELS[type] ?? type}
    </Badge>
  )
}
