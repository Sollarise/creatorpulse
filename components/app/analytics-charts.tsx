"use client"

import { TrendAreaChart, MultiLineChart, VerticalBarChart, HorizontalBarChart } from "@/components/app/charts"
import { ChartCard } from "@/components/app/chart-card"
import { formatCompact, formatCurrency } from "@/lib/format"

type TrendRow = {
  date: string
  views: number
  subscribers: number
  watch_time: number
  engagement: number
  revenue: number
}

type TrafficRow = { source: string; views: number }

export function AnalyticsCharts({ trend, traffic }: { trend: TrendRow[]; traffic: TrafficRow[] }) {
  return (
    <div className="flex flex-col gap-4">
      <ChartCard title="Views & subscribers" description="Daily views with net new subscribers">
        <MultiLineChart
          data={trend}
          xKey="date"
          series={[
            { key: "views", color: "var(--color-chart-1)" },
            { key: "subscribers", color: "var(--color-chart-2)" },
          ]}
          formatter={(v) => formatCompact(v)}
        />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Watch time" description="Daily hours watched">
          <TrendAreaChart
            data={trend}
            xKey="date"
            yKey="watch_time"
            color="var(--color-chart-3)"
            formatter={(v) => `${formatCompact(v)} hrs`}
          />
        </ChartCard>

        <ChartCard title="Engagement rate" description="Daily engagement percentage">
          <TrendAreaChart
            data={trend}
            xKey="date"
            yKey="engagement"
            color="var(--color-chart-4)"
            formatter={(v) => `${v.toFixed(1)}%`}
          />
        </ChartCard>

        <ChartCard title="Revenue" description="Daily estimated earnings" className="lg:col-span-2">
          <VerticalBarChart
            data={trend}
            xKey="date"
            yKey="revenue"
            color="var(--color-chart-5)"
            formatter={(v) => formatCurrency(v, true)}
          />
        </ChartCard>

        <ChartCard title="Traffic sources" description="Where your views came from" className="lg:col-span-2">
          <HorizontalBarChart
            data={traffic}
            categoryKey="source"
            valueKey="views"
            formatter={(v) => formatCompact(v)}
          />
        </ChartCard>
      </div>
    </div>
  )
}
