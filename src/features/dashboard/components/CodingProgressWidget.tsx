import { Code2, GitMerge, Flame } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui"
import type { CodingStats } from "@/data/mock/dashboard"

export interface CodingProgressWidgetProps {
  stats: CodingStats
}

export function CodingProgressWidget({ stats }: CodingProgressWidgetProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          Coding Progress
        </CardTitle>
        <CardDescription>High-level statistics overview.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3 pt-0">
        {/* GitHub Streak */}
        <div className="flex flex-col rounded-xl border border-border bg-muted/20 p-3 text-center">
          <Flame className="h-4 w-4 mx-auto text-primary mb-1 shrink-0" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Streak</span>
          <span className="text-lg font-bold text-white mt-1 shrink-0">{stats.githubStreak}d</span>
        </div>

        {/* LeetCode Solved */}
        <div className="flex flex-col rounded-xl border border-border bg-muted/20 p-3 text-center">
          <Code2 className="h-4 w-4 mx-auto text-primary mb-1 shrink-0" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Solved</span>
          <span className="text-lg font-bold text-white mt-1 shrink-0">{stats.leetcodeSolved}</span>
        </div>

        {/* Open PRs */}
        <div className="flex flex-col rounded-xl border border-border bg-muted/20 p-3 text-center">
          <GitMerge className="h-4 w-4 mx-auto text-primary mb-1 shrink-0" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Open PRs</span>
          <span className="text-lg font-bold text-white mt-1 shrink-0">{stats.openPRs}</span>
        </div>
      </CardContent>
    </Card>
  )
}
