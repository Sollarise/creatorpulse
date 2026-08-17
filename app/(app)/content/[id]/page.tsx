import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Eye, Heart, MessageCircle, Clock, DollarSign, TrendingUp } from "lucide-react"
import { getChannel, getVideo, getAnalytics, sumWindow } from "@/lib/queries"
import { PageHeader } from "@/components/app/page-header"
import { StatCard } from "@/components/app/stat-card"
import { ChartCard } from "@/components/app/chart-card"
import { ContentBadge } from "@/components/app/content-badge"
import { TrendAreaChart } from "@/components/app/charts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatCompact,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatShortDate,
  formatWatchTime,
} from "@/lib/format"

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const channel = await getChannel()
  if (!channel) return null

  const video = await getVideo(channel.id, id)
  if (!video) notFound()

  const analytics = await getAnalytics(channel.id, 28)
  const trend = analytics.slice(-28).map((r) => ({
    date: formatShortDate(r.date),
    views: r.views,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link href="/content">
            <ArrowLeft className="h-4 w-4" />
            Back to content
          </Link>
        </Button>
        <PageHeader
          title={video.title}
          description={video.published_at ? `Published ${formatDate(video.published_at)}` : "Not yet published"}
        >
          <ContentBadge type={video.content_type} />
        </PageHeader>
      </div>

      {video.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{video.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Views" value={formatCompact(video.views)} icon={Eye} />
        <StatCard label="Likes" value={formatNumber(video.likes)} icon={Heart} />
        <StatCard label="Comments" value={formatNumber(video.comments)} icon={MessageCircle} />
        <StatCard label="Watch time" value={formatWatchTime(video.watch_time)} icon={Clock} />
        <StatCard label="Engagement" value={formatPercent(video.engagement_rate)} icon={TrendingUp} />
        <StatCard label="Est. revenue" value={formatCurrency(video.revenue)} icon={DollarSign} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Channel views" description="Last 28 days for context" className="lg:col-span-2">
          <TrendAreaChart data={trend} xKey="date" yKey="views" formatter={(v) => formatCompact(v)} />
        </ChartCard>
        <ChartCard title="Click-through rate" description="Thumbnail performance">
          <div className="flex h-full flex-col items-center justify-center py-6">
            <span className="font-mono text-4xl font-semibold tabular-nums text-foreground">
              {formatPercent(video.ctr)}
            </span>
            <p className="mt-2 text-sm text-muted-foreground">CTR</p>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
