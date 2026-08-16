"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const AXIS = { stroke: "var(--color-muted-foreground)", fontSize: 11 }
const GRID = "var(--color-border)"

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

function TooltipBox({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  formatter?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      <div className="grid gap-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground capitalize">{p.name}</span>
            <span className="ml-auto font-mono font-medium text-popover-foreground">
              {formatter ? formatter(p.value) : p.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

type SeriesData = Record<string, string | number>

export function TrendAreaChart({
  data,
  xKey,
  yKey,
  color = "var(--color-chart-1)",
  height = 260,
  formatter,
}: {
  data: SeriesData[]
  xKey: string
  yKey: string
  color?: string
  height?: number
  formatter?: (v: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS} minTickGap={28} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={AXIS}
          width={48}
          tickFormatter={(v) => (formatter ? formatter(v) : v)}
        />
        <Tooltip content={<TooltipBox formatter={formatter} />} />
        <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} fill={`url(#fill-${yKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MultiLineChart({
  data,
  xKey,
  series,
  height = 260,
  formatter,
}: {
  data: SeriesData[]
  xKey: string
  series: { key: string; color: string }[]
  height?: number
  formatter?: (v: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS} minTickGap={28} />
        <YAxis tickLine={false} axisLine={false} tick={AXIS} width={48} tickFormatter={(v) => (formatter ? formatter(v) : v)} />
        <Tooltip content={<TooltipBox formatter={formatter} />} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function VerticalBarChart({
  data,
  xKey,
  yKey,
  color = "var(--color-chart-1)",
  height = 260,
  formatter,
}: {
  data: SeriesData[]
  xKey: string
  yKey: string
  color?: string
  height?: number
  formatter?: (v: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={AXIS} minTickGap={16} />
        <YAxis tickLine={false} axisLine={false} tick={AXIS} width={48} tickFormatter={(v) => (formatter ? formatter(v) : v)} />
        <Tooltip cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} content={<TooltipBox formatter={formatter} />} />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function HorizontalBarChart({
  data,
  categoryKey,
  valueKey,
  color = "var(--color-chart-2)",
  height = 260,
  formatter,
}: {
  data: SeriesData[]
  categoryKey: string
  valueKey: string
  color?: string
  height?: number
  formatter?: (v: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} tick={AXIS} tickFormatter={(v) => (formatter ? formatter(v) : v)} />
        <YAxis
          type="category"
          dataKey={categoryKey}
          tickLine={false}
          axisLine={false}
          tick={AXIS}
          width={92}
        />
        <Tooltip cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} content={<TooltipBox formatter={formatter} />} />
        <Bar dataKey={valueKey} fill={color} radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DonutChart({
  data,
  nameKey,
  valueKey,
  height = 240,
  formatter,
}: {
  data: SeriesData[]
  nameKey: string
  valueKey: string
  height?: number
  formatter?: (v: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius="58%"
          outerRadius="88%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<TooltipBox formatter={formatter} />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export { CHART_COLORS }
