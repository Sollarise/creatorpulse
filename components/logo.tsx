import { cn } from "@/lib/utils"

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M3 13.5h3.2l2-6.5 3.4 11 2.6-8 1.6 3.5H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Creator<span className="text-primary">Pulse</span>
        </span>
      )}
    </div>
  )
}
