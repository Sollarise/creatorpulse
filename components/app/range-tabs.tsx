"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const RANGES = [
  { label: "7D", value: "7" },
  { label: "28D", value: "28" },
  { label: "90D", value: "90" },
]

export function RangeTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get("range") ?? "28"

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("range", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="inline-flex items-center rounded-md border border-border bg-card p-0.5">
      {RANGES.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => select(r.value)}
          aria-pressed={current === r.value}
          className={cn(
            "rounded px-3 py-1 text-xs font-medium transition-colors",
            current === r.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
