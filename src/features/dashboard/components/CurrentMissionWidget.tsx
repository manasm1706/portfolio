import { Target, Flag } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Progress, Badge } from "@/components/ui"
import type { CurrentMission } from "@/data/mock/dashboard"

export interface CurrentMissionWidgetProps {
  mission: CurrentMission
  variant?: "default" | "elevated" | "interactive"
}

export function CurrentMissionWidget({ mission, variant = "default" }: CurrentMissionWidgetProps) {
  return (
    <Card className="h-full" variant={variant}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
            <Target className="h-4 w-4 text-secondary" />
            Current Mission
          </CardTitle>
          <Badge variant="secondary" className="bg-secondary/15 text-secondary border-secondary/20">
            Active
          </Badge>
        </div>
        <CardDescription>Primary target milestones.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-white">
            {mission.title}
          </h4>
          <p className="text-xs text-muted-foreground">
            Target deadline: {mission.target}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Overall Prep</span>
            <span className="text-secondary font-bold">{mission.progress}%</span>
          </div>
          <Progress value={mission.progress} className="h-2 bg-muted/50" />
        </div>

        {/* Key Areas of Focus */}
        <div className="space-y-2 pt-1 border-t border-border/40">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Flag className="h-3 w-3 text-secondary" />
            Key Areas
          </span>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {mission.focus.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-lg border border-border bg-muted/20 px-2 py-1 text-xs font-medium text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
