import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Logo } from "@/components/logo"
import { SidebarNav } from "@/components/app/sidebar-nav"
import { Topbar } from "@/components/app/topbar"
import { getUser, getProfile, getChannel } from "@/lib/queries"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect("/auth/login")

  // Seeds demo data on first visit and returns the channel.
  const [profile, channel] = await Promise.all([getProfile(), getChannel()])

  const name = profile?.full_name ?? user.email?.split("@")[0] ?? "Creator"
  const email = user.email ?? ""
  const channelName = channel?.channel_name ?? "Your channel"

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar name={name} email={email} channelName={channelName} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
