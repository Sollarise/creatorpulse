import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
        That authentication link is invalid or has expired. Please try signing in again.
      </p>
      <Button asChild className="mt-6">
        <Link href="/auth/login">Back to sign in</Link>
      </Button>
    </div>
  )
}
