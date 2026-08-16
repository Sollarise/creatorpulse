import Link from "next/link"
import { Eye, Clock, Users, DollarSign, ArrowUpRight } from "lucide-react"
import { getChannel, getAnalytics, getVideos, sumWindow } from "@/lib/queries"
import { PageHeader } from "@/components/app/page-header"
import { StatCard } from "@/components/app/stat-card"
import { ChartCard } from "@/components/app/chart-card"
import { ContentBadge } from "@/components/app/content-badge"
import { TrendAreaChart, VerticalBarChart, HorizontalBarChart } from "@/components/app/charts"
import { Button } from "@/components/ui/button"
import {
  formatCompact,
  formatNumber,
  formatCurrency,
  formatWatchTime,
  formatShortDate,
  pctChange,
} from "@/lib/format"

export default async function DashboardPage() {
  const channel = await getChannel()
  if (!channel) return null

  const analytics = await getAnalytics(channel.id, 90)
  const videos = await getVideos(channel.id)

  const now = sumWindow(analytics, 28)
  const prev = sumWindow(analytics.slice(0, -28), 28)

  // Views trend (last 28 days)
  const viewTrend = analytics.slice(-28).map((r) => ({ date: formatShortDate(r.date), views: r.views }))
  const revenueTrend = analytics.slice(-28).map((r) => ({ date: formatShortDate(r.date), revenue: Number(r.revenue) }))

  // Traffic sources (last 28 days aggregated)
  const trafficMap = new Map<string, number>()
  for (const r of analytics.slice(-28)) {
    if (!r.traffic_source) continue
    trafficMap.set(r.traffic_source, (trafficMap.get(r.traffic_source) ?? 0) + r.views)
  }
  const traffic = [...trafficMap.entries()]
    .map(([source, views]) => ({ source, views }))
    .sort((a, b) => b.views - a.views)

  const topContent = [...videos].sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Your channel at a glance — last 28 days.">
        <Button asChild variant="outline" className="bg-transparent">
          <Link href="/analytics">
            View analytics
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Views"
          value={formatCompact(now.views)}
          change={pctChange(now.views, prev.views)}
          icon={Eye}
        />
        <StatCard
          label="Watch time"
          value={formatWatchTime(now.watchTime)}
          change={pctChange(now.watchTime, prev.watchTime)}
          icon={Clock}
        />
        <StatCard
          label="New subscribers"
          value={formatNumber(now.subscribers)}
          change={pctChange(now.subscribers, prev.subscribers)}
          icon={Users}
        />
        <StatCard
          label="Est. revenue"
          value={formatCurrency(now.revenue, true)}
          change={pctChange(now.revenue, prev.revenue)}
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Views over time" description="Daily views, last 28 days" className="lg:col-span-2">
          <TrendAreaChart data={viewTrend} xKey="date" yKey="views" formatter={(v) => formatCompact(v)} />
        </ChartCard>
        <ChartCard title="Traffic sources" description="Where views came from">
          <HorizontalBarChart
            data={traffic}
            categoryKey="source"
            valueKey="views"
            formatter={(v) => formatCompact(v)}
          />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Estimated revenue" description="Daily earnings, last 28 days" className="lg:col-span-2">
          <VerticalBarChart
            data={revenueTrend}
            xKey="date"
            yKey="revenue"
            color="var(--color-chart-5)"
            formatter={(v) => formatCurrency(v, true)}
          />
        </ChartCard>

        <ChartCard title="Top content" description="Best performing videos" action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/content">All</Link>
          </Button>
        }>
          <ul className="flex flex-col gap-3">
            {topContent.map((v, i) => (
              <li key={v.id}>
                <Link
                  href={`/content/${v.id}`}
                  className="group flex items-start gap-3 rounded-md p-1 transition-colors hover:bg-secondary/60"
                >
                  <span className="mt-0.5 w-4 shrink-0 font-mono text-sm text-muted-foreground">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium group-hover:text-primary">{v.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <ContentBadge type={v.content_type} />
                      <span>{formatCompact(v.views)} views</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </div>
  )
}
