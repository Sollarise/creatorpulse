"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        data: { full_name: fullName },
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes("weak") || error.message.toLowerCase().includes("password")) {
        setError("Please choose a stronger password.")
      } else if (error.status === 429) {
        setError("Too many attempts. Please wait a moment and try again.")
      } else {
        setError("We couldn't create your account. Please try again.")
      }
      setLoading(false)
      return
    }

    // If email confirmation is off, a session exists — go straight in.
    if (data.session) {
      router.push("/dashboard")
      router.refresh()
      return
    }
    router.push("/auth/sign-up-success")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start tracking your channel in under a minute.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Alex Rivera"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
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
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-1 w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-foreground hover:text-primary">
          Sign in
        </Link>
      </p>
    </div>
  )
}
