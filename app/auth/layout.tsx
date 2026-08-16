import type React from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"

const HIGHLIGHTS = [
  { stat: "2.4M+", label: "views tracked daily across creator channels" },
  { stat: "18%", label: "average watch-time lift after acting on insights" },
  { stat: "60s", label: "to connect a channel and see your first report" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 lg:p-10">
        <Link href="/" className="w-fit">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-muted-foreground) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative">
          <p className="text-sm font-medium text-primary">CreatorPulse Analytics</p>
          <h2 className="mt-4 max-w-md text-balance text-3xl font-semibold leading-tight tracking-tight text-sidebar-foreground">
            Understand your audience. Grow with clarity.
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Every view, minute watched, and dollar earned — organized into one calm, readable dashboard built for
            people who make things.
          </p>
        </div>

        <dl className="relative grid gap-6">
          {HIGHLIGHTS.map((h) => (
            <div key={h.stat} className="flex items-baseline gap-4 border-t border-sidebar-border pt-4">
              <dt className="w-20 shrink-0 font-mono text-2xl font-semibold text-primary">{h.stat}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{h.label}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  )
}
