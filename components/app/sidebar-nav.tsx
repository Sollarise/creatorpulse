"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MAIN_NAV, SECONDARY_NAV, type NavItem } from "@/lib/nav"

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname()
  const active = pathname === item.href || pathname.startsWith(item.href + "/")
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
      {item.title}
    </Link>
  )
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      <div className="flex flex-col gap-1">
        {MAIN_NAV.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-1 pt-4">
        {SECONDARY_NAV.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  )
}
