import { Suspense } from "react"
import { LineChart as LineChartIcon, Eye, Users, Clock, Heart, DollarSign, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { getChannel, getAnalytics, sumWindow } from "@/lib/queries"
import { PageHeader } from "@/components/app/page-header"
import { StatCard } from "@/components/app/stat-card"
import { RangeTabs } from "@/components/app/range-tabs"
import { AnalyticsCharts } from "@/components/app/analytics-charts"
import { EmptyState } from "@/components/app/empty-state"
import {
  formatCompact,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatShortDate,
  formatWatchTime,
  pctChange,
} from "@/lib/format"
import type { AnalyticsRow } from "@/lib/types"

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const { range } = await searchParams
  const days = [7, 28, 90].includes(Number(range)) ? Number(range) : 28

  const channel = await getChannel()
  if (!channel) return null

  const analytics = await getAnalytics(channel.id, days)

  if (analytics.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Analytics" description="Detailed performance across all your content.">
          <Suspense fallback={null}>
            <RangeTabs />
          </Suspense>
        </PageHeader>
        <EmptyState
          icon={LineChartIcon}
          title="No analytics yet"
          description="Once your channel has viewing activity, your detailed metrics will appear here."
        />
      </div>
    )
  }

  const current = sumWindow(analytics, days)
  const prevDays = Math.min(days, Math.floor(analytics.length / 2))
  const prev = prevDays > 0 ? sumWindow(analytics.slice(0, -days), prevDays) : current

  const avgCtr =
    analytics.length > 0
      ? analytics.reduce((a, r) => a + Number(r.engagement_rate), 0) / analytics.length
      : 0

  const trend = analytics.map((r: AnalyticsRow) => ({
    date: formatShortDate(r.date),
    views: r.views,
    subscribers: r.subscribers,
    watch_time: Number(r.watch_time),
    engagement: Number(r.engagement_rate),
    revenue: Number(r.revenue),
  }))

  const trafficMap = new Map<string, number>()
  for (const r of analytics) {
    if (!r.traffic_source) continue
    trafficMap.set(r.traffic_source, (trafficMap.get(r.traffic_source) ?? 0) + r.views)
  }
  const traffic = [...trafficMap.entries()]
    .map(([source, views]) => ({ source, views }))
    .sort((a, b) => b.views - a.views)

  const stats: Array<{ label: string; value: string; change: number; icon: LucideIcon }> = [
    { label: "Views", value: formatCompact(current.views), change: pctChange(current.views, prev.views), icon: Eye },
    { label: "New subscribers", value: formatNumber(current.subscribers), change: pctChange(current.subscribers, prev.subscribers), icon: Users },
    { label: "Watch time", value: formatWatchTime(current.watchTime), change: pctChange(current.watchTime, prev.watchTime), icon: Clock },
    { label: "Avg. engagement", value: formatPercent(current.avgEngagement), change: pctChange(current.avgEngagement, prev.avgEngagement), icon: Heart },
    { label: "Est. revenue", value: formatCurrency(current.revenue, true), change: pctChange(current.revenue, prev.revenue), icon: DollarSign },
    { label: "Avg. CTR", value: formatPercent(avgCtr), change: pctChange(avgCtr, prev.avgEngagement), icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analytics" description="Detailed performance across all your content.">
        <Suspense fallback={null}>
          <RangeTabs />
        </Suspense>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} change={s.change} icon={s.icon} />
        ))}
      </div>

      <AnalyticsCharts trend={trend} traffic={traffic} />
    </div>
  )
}
