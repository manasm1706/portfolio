import { Code2, Flame, Award, ExternalLink, Activity } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui"
import type { LeetcodeStats } from "@/data/mock/coding"

export interface LeetcodeStatsCardProps {
  stats: LeetcodeStats
}

export function LeetcodeStatsCard({ stats }: LeetcodeStatsCardProps) {
  // Generate mock LeetCode heatmap grid: 7 rows x 18 columns = 126 days
  const gridCells = Array.from({ length: 126 }, () => {
    let level = 0
    const rand = Math.random()
    if (rand > 0.88) level = 3
    else if (rand > 0.75) level = 2
    else if (rand > 0.45) level = 1
    return level
  })

  const getCellColor = (level: number) => {
    switch (level) {
      case 3:
        return "bg-warning"
      case 2:
        return "bg-warning/60"
      case 1:
        return "bg-warning/30"
      default:
        return "bg-muted/30"
    }
  }

  const { easy, medium, hard, total } = stats.solvedCount

  return (
    <Card className="h-full border border-border/40 bg-card-surface-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-warning" />
            LeetCode Overview
          </CardTitle>
          <a
            href={stats.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-muted-foreground hover:text-white transition-colors flex items-center gap-1 bg-muted/20 border border-border/40 rounded-lg px-2 py-1"
          >
            <span>@{stats.username}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <CardDescription>Consolidated solve metrics and daily heatmap status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        {/* Core Stats info */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-muted/10 p-3 text-center">
            <Activity className="h-4 w-4 mx-auto text-warning mb-1" />
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">Active Days</span>
            <span className="text-base font-bold text-white mt-1 block">{stats.activeDays} Days</span>
          </div>
          <div className="rounded-xl border border-border bg-muted/10 p-3 text-center">
            <Flame className="h-4 w-4 mx-auto text-warning mb-1" />
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">Max Streak</span>
            <span className="text-base font-bold text-white mt-1 block">{stats.maxStreak} Days</span>
          </div>
          <div className="rounded-xl border border-border bg-muted/10 p-3 text-center">
            <Award className="h-4 w-4 mx-auto text-warning mb-1" />
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">Contest</span>
            <span className="text-base font-bold text-white mt-1 block">{stats.contestRating}</span>
          </div>
        </div>

        {/* Difficulty Distribution Progress Meters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">
              Difficulty Distribution
            </span>
            <span className="text-xs font-bold text-white">
              Solved {total} / 3977
            </span>
          </div>

          <div className="space-y-2 bg-muted/5 border border-border/40 p-3 rounded-xl">
            {/* Easy Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span className="text-muted-foreground/80">Easy</span>
                <span className="text-white font-bold">{easy} <span className="text-[9px] font-normal text-muted-foreground/60">/ 951</span></span>
              </div>
              <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success transition-all"
                  style={{ width: `${(easy / 951) * 100}%` }}
                />
              </div>
            </div>

            {/* Medium Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span className="text-muted-foreground/80">Medium</span>
                <span className="text-white font-bold">{medium} <span className="text-[9px] font-normal text-muted-foreground/60">/ 2077</span></span>
              </div>
              <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning transition-all"
                  style={{ width: `${(medium / 2077) * 100}%` }}
                />
              </div>
            </div>

            {/* Hard Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span className="text-muted-foreground/80">Hard</span>
                <span className="text-white font-bold">{hard} <span className="text-[9px] font-normal text-muted-foreground/60">/ 949</span></span>
              </div>
              <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-danger transition-all"
                  style={{ width: `${(hard / 949) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap area */}
        <div className="space-y-2">
          <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">
            LeetCode Heatmap Embed Slot
          </span>
          <div className="border border-border/40 bg-muted/5 rounded-xl p-3.5 flex flex-col justify-center">
            {/* 7 rows of 18 columns grid container */}
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-center">
              {gridCells.map((level, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 w-2.5 rounded-[2px] transition-colors ${getCellColor(level)}`}
                  title={`Activity level: ${level}`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-[9px] text-muted-foreground/40 mt-3 px-3 font-semibold uppercase tracking-wider">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-[1px] bg-muted/30" />
                <div className="h-2 w-2 rounded-[1px] bg-warning/30" />
                <div className="h-2 w-2 rounded-[1px] bg-warning/60" />
                <div className="h-2 w-2 rounded-[1px] bg-warning" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
