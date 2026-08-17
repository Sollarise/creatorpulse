"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, Film, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ContentBadge } from "@/components/app/content-badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCompact, formatCurrency, formatDate, formatPercent } from "@/lib/format"
import type { Video } from "@/lib/types"

type SortKey = "published_at" | "views" | "engagement_rate" | "revenue"

const PAGE_SIZE = 8

export function ContentTable({ videos }: { videos: Video[] }) {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("published_at")
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let rows = videos
    if (type !== "all") rows = rows.filter((v) => v.content_type === type)
    if (query.trim()) {
      const q = query.toLowerCase()
      rows = rows.filter((v) => v.title.toLowerCase().includes(q))
    }
    rows = [...rows].sort((a, b) => {
      if (sortKey === "published_at") {
        return new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime()
      }
      return Number(b[sortKey]) - Number(a[sortKey])
    })
    return rows
  }, [videos, query, type, sortKey])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const rows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  function reset() {
    setQuery("")
    setType("all")
    setSortKey("published_at")
    setPage(0)
  }

  const hasFilters = query.trim() !== "" || type !== "all"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Search content..."
            className="pl-8"
          />
        </div>
        <Select
          value={type}
          onValueChange={(v) => {
            setType(v)
            setPage(0)
          }}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="short">Shorts</SelectItem>
            <SelectItem value="live">Live</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="w-full sm:w-44">
            <ArrowUpDown className="h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published_at">Newest first</SelectItem>
            <SelectItem value="views">Most viewed</SelectItem>
            <SelectItem value="engagement_rate">Top engagement</SelectItem>
            <SelectItem value="revenue">Top revenue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Title</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="hidden text-right md:table-cell">Engagement</TableHead>
              <TableHead className="hidden text-right lg:table-cell">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No content matches your filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <Link href={`/content/${v.id}`} className="group flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                        <Film className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium group-hover:text-primary">
                          {v.title}
                        </span>
                        <span className="mt-0.5 block">
                          <ContentBadge type={v.content_type} />
                        </span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {v.published_at ? formatDate(v.published_at) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatCompact(v.views)}
                  </TableCell>
                  <TableCell className="hidden text-right font-mono tabular-nums md:table-cell">
                    {formatPercent(v.engagement_rate)}
                  </TableCell>
                  <TableCell className="hidden text-right font-mono tabular-nums lg:table-cell">
                    {formatCurrency(v.revenue)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={reset}>
                Reset filters
              </Button>
            )}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {safePage + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
