import Link from "next/link"
import { MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MailCheck className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Check your inbox</h1>
      <p className="mx-auto mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
        We sent you a confirmation link. Click it to verify your email, then sign in to open your dashboard.
      </p>
      <Button asChild variant="outline" className="mt-6 bg-transparent">
        <Link href="/auth/login">Back to sign in</Link>
      </Button>
    </div>
  )
}
