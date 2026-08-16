"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MailCheck } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    // Fire and forget — always show success to avoid account enumeration.
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
    })
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
          If an account exists for {email}, we sent a link to reset your password.
        </p>
        <Button asChild variant="outline" className="mt-6 bg-transparent">
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@channel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="font-medium text-foreground hover:text-primary">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
