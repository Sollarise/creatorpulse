"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Logo } from "@/components/logo"
import { SidebarNav } from "@/components/app/sidebar-nav"
import { UserMenu } from "@/components/app/user-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function Topbar({
  name,
  email,
  channelName,
}: {
  name: string
  email: string
  channelName: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-72 flex-col p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 items-center gap-3">
        <div className="hidden flex-col lg:flex">
          <span className="text-xs text-muted-foreground">Channel</span>
          <span className="text-sm font-medium leading-tight">{channelName}</span>
        </div>
      </div>

      <div className="lg:hidden">
        <Logo showText={false} />
      </div>

      <div className="flex items-center gap-2">
        <UserMenu name={name} email={email} />
      </div>
    </header>
  )
}
