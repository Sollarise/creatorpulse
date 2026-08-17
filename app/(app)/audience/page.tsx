import { Users } from "lucide-react"
import { getChannel, getAudience } from "@/lib/queries"
import { PageHeader } from "@/components/app/page-header"
import { StatCard } from "@/components/app/stat-card"
import { ChartCard } from "@/components/app/chart-card"
import { EmptyState } from "@/components/app/empty-state"
import { DonutChart, HorizontalBarChart, VerticalBarChart, CHART_COLORS } from "@/components/app/charts"
import { formatPercent } from "@/lib/format"
import type { AudienceRow } from "@/lib/types"

function byDim(rows: AudienceRow[], dim: AudienceRow["dimension"]) {
  return rows.filter((r) => r.dimension === dim)
}

export default async function AudiencePage() {
  const channel = await getChannel()
  if (!channel) return null

  const rows = await getAudience(channel.id)

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Audience" description="Who's watching and where they come from." />
        <EmptyState
          icon={Users}
          title="No audience data yet"
          description="Once viewers engage with your content, demographic and geography breakdowns will appear here."
        />
      </div>
    )
  }

  const age = byDim(rows, "age").map((r) => ({
    label: r.age_group ?? "—",
    value: Number(r.percentage),
  }))
  const gender = byDim(rows, "gender").map((r) => ({
    label: r.gender ?? "—",
    value: Number(r.percentage),
  }))
  const countries = byDim(rows, "country")
    .map((r) => ({ source: r.country ?? "—", views: Number(r.percentage) }))
    .sort((a, b) => b.views - a.views)
  const hours = byDim(rows, "hour")
    .sort((a, b) => (a.hour ?? 0) - (b.hour ?? 0))
    .map((r) => ({ hour: `${r.hour}:00`, value: Number(r.percentage) }))
  const types = byDim(rows, "type").map((r) => ({
    label: r.viewer_type ?? "—",
    value: Number(r.percentage),
  }))

  const topCountry = countries[0]
  const topAge = [...age].sort((a, b) => b.value - a.value)[0]
  const returning = types.find((t) => t.label === "Returning")?.value ?? 0
  const newViewers = types.find((t) => t.label === "New")?.value ?? 0
  const malePct = gender.find((g) => g.label === "Male")?.value ?? 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Audience" description="Who's watching and where they come from." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Top country" value={topCountry?.source ?? "—"} helpText={`${formatPercent(topCountry?.views ?? 0)} of viewers`} icon={Users} />
        <StatCard label="Top age group" value={topAge?.label ?? "—"} helpText={`${formatPercent(topAge?.value ?? 0)} of viewers`} icon={Users} />
        <StatCard label="Returning viewers" value={formatPercent(returning)} helpText="vs. new viewers" icon={Users} />
        <StatCard label="New viewers" value={formatPercent(newViewers)} helpText="of total audience" icon={Users} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Age distribution" description="Share of viewers by age group">
          <DonutChart data={age} nameKey="label" valueKey="value" formatter={(v) => formatPercent(v)} />
          <Legend items={age.map((a, i) => ({ label: a.label, color: CHART_COLORS[i % CHART_COLORS.length] }))} />
        </ChartCard>

        <ChartCard title="Gender split" description="Share of viewers by gender">
          <DonutChart data={gender} nameKey="label" valueKey="value" formatter={(v) => formatPercent(v)} />
          <Legend items={gender.map((g, i) => ({ label: g.label, color: CHART_COLORS[i % CHART_COLORS.length] }))} />
        </ChartCard>

        <ChartCard title="Top countries" description="Where your viewers are located" className="lg:col-span-2">
          <HorizontalBarChart data={countries} categoryKey="source" valueKey="views" formatter={(v) => formatPercent(v)} />
        </ChartCard>

        <ChartCard title="When viewers are active" description="Share of watch time by hour (local)" className="lg:col-span-2">
          <VerticalBarChart data={hours} xKey="hour" yKey="value" color="var(--color-chart-3)" formatter={(v) => `${v.toFixed(0)}%`} />
        </ChartCard>

        <ChartCard title="Viewer type" description="Returning vs. new viewers" className="lg:col-span-2">
          <DonutChart data={types} nameKey="label" valueKey="value" formatter={(v) => formatPercent(v)} />
          <Legend items={types.map((t, i) => ({ label: t.label, color: CHART_COLORS[i % CHART_COLORS.length] }))} />
        </ChartCard>
      </div>
    </div>
  )
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
