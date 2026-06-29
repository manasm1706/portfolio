import * as React from "react"
import { CheckCircle2, AlertTriangle, Flame } from "lucide-react"
import type { UserProfile } from "@/data/mock/dashboard"

export interface HeroSectionProps {
  user: UserProfile
  focusCount: number
  upcomingCount: number
}

export function HeroSection({ user, focusCount, upcomingCount }: HeroSectionProps) {
  // Format today's date: "Friday, June 26"
  const formattedDate = React.useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    })
  }, [])

  // Greeting based on current time
  const greeting = React.useMemo(() => {
    const hours = new Date().getHours()
    if (hours < 12) return "Good Morning"
    if (hours < 18) return "Good Afternoon"
    return "Good Evening"
  }, [])

  return (
    <div className="space-y-4 pb-2">
      {/* Date and Greeting */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider block">
          {formattedDate}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          {greeting}, {user.name} 👋
        </h1>
      </div>

      {/* Summary Metrics Row */}
      <div className="flex flex-wrap gap-4 pt-1.5">
        {/* Focus Items Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-success/15 bg-success/5 px-3 py-1.5 text-xs font-medium text-success">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>{focusCount} focus tasks today</span>
        </div>

        {/* Deadlines Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-warning/15 bg-warning/5 px-3 py-1.5 text-xs font-medium text-warning">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span>{upcomingCount} deadlines this week</span>
        </div>

        {/* Coding Streak Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
          <Flame className="h-4 w-4 text-primary fill-current" />
          <span>{user.streak} day coding streak</span>
        </div>
      </div>
    </div>
  )
}
