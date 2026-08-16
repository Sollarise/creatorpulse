import { LayoutDashboard, LineChart, Users, DollarSign, Film, FileText, Settings, LifeBuoy } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type NavItem = { title: string; href: string; icon: LucideIcon }

export const MAIN_NAV: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/analytics", icon: LineChart },
  { title: "Audience", href: "/audience", icon: Users },
  { title: "Revenue", href: "/revenue", icon: DollarSign },
  { title: "Content", href: "/content", icon: Film },
  { title: "Reports", href: "/reports", icon: FileText },
]

export const SECONDARY_NAV: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help", href: "/help", icon: LifeBuoy },
]
