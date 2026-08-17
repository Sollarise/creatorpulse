import { Film } from "lucide-react"
import { getChannel, getVideos } from "@/lib/queries"
import { PageHeader } from "@/components/app/page-header"
import { ContentTable } from "@/components/app/content-table"
import { EmptyState } from "@/components/app/empty-state"

export default async function ContentPage() {
  const channel = await getChannel()
  if (!channel) return null

  const videos = await getVideos(channel.id)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Content"
        description={`${videos.length} ${videos.length === 1 ? "video" : "videos"} on your channel.`}
      />
      {videos.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No content yet"
          description="Once you publish content, it will appear here with full performance metrics."
        />
      ) : (
        <ContentTable videos={videos} />
      )}
    </div>
  )
}
