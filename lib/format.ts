export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n))
}

export function formatCurrency(n: number, compact = false): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(n)
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`
}

/** Watch time is stored in hours. Format as a human string. */
export function formatWatchTime(hours: number): string {
  if (hours >= 1000) return `${formatCompact(hours)} hrs`
  return `${formatNumber(hours)} hrs`
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}
