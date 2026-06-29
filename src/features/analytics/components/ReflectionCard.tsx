import { Sparkles, Flame, Trophy } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui"
import type { ReflectionSummary } from "@/data/mock/analytics"

export interface ReflectionCardProps {
  reflection: ReflectionSummary
}

export function ReflectionCard({ reflection }: ReflectionCardProps) {
  return (
    <Card variant="elevated" className="h-full border border-secondary/20 bg-card-surface-elevated-premium">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-secondary flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-secondary" />
          Monthly Reflection
        </CardTitle>
        <CardDescription>Automated workload review and study suggestions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Reflection Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/5 border border-border/40 p-3.5 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider block">Solved</span>
            <span className="text-base font-bold text-white block">+{reflection.problemsSolvedThisMonth} Items</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider block">Projects</span>
            <span className="text-base font-bold text-white block">{reflection.projectsUpdated} Active</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider block">Apps</span>
            <span className="text-base font-bold text-white block">+{reflection.applicationsSubmitted} Submitted</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider block">Hackathons</span>
            <span className="text-base font-bold text-white block">{reflection.hackathonsJoined} Joined</span>
          </div>
        </div>

        {/* Dynamic Observations */}
        <div className="space-y-3.5 pt-1">
          {/* Most active area */}
          <div className="flex items-start gap-3 border border-border/40 bg-muted/10 p-3 rounded-xl">
            <div className="h-8 w-8 rounded-lg bg-success/15 border border-success/20 flex items-center justify-center text-success shrink-0 mt-0.5">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider block">Most Active Area</span>
              <p className="text-xs font-semibold text-white mt-0.5">{reflection.mostActiveArea}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
                Excellent output. You have allocated substantial building cycles and updates to this area this month.
              </p>
            </div>
          </div>

          {/* Least active area */}
          <div className="flex items-start gap-3 border border-border/40 bg-muted/10 p-3 rounded-xl">
            <div className="h-8 w-8 rounded-lg bg-warning/15 border border-warning/20 flex items-center justify-center text-warning shrink-0 mt-0.5">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider block">Least Active Area</span>
              <p className="text-xs font-semibold text-white mt-0.5">{reflection.leastActiveArea}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
                Neglected area. Consider allocating study slots or graphing tasks here next week to build balanced skill distributions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
