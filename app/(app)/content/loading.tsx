import { PageHeader } from "@/components/app/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Content" description="Loading your content..." />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-44" />
      </div>
      <div className="rounded-xl border border-border bg-card">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="m-3 h-14" />
        ))}
      </div>
    </div>
  )
}
