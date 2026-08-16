import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatPercent } from "@/lib/format"

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  helpText,
}: {
  label: string
  value: string
  change?: number
  icon: LucideIcon
  helpText?: string
}) {
  const positive = (change ?? 0) >= 0
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {change !== undefined && (
          <span
            className={cn(
              "mb-0.5 flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {formatPercent(Math.abs(change))}
          </span>
        )}
      </div>
      {helpText && <p className="mt-1 text-xs text-muted-foreground">{helpText}</p>}
    </Card>
  )
}
