import { Star, Flame, ExternalLink, FolderCode } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui"
import type { GithubStats } from "@/data/mock/coding"

export interface GithubStatsCardProps {
  stats: GithubStats
}

export function GithubStatsCard({ stats }: GithubStatsCardProps) {
  // Generate mock contribution cells: 7 rows x 26 columns = 182 days
  const gridCells = Array.from({ length: 182 }, () => {
    // Randomize activity level: 0 = none, 1 = low, 2 = medium, 3 = high
    let level = 0
    const rand = Math.random()
    if (rand > 0.85) level = 3
    else if (rand > 0.7) level = 2
    else if (rand > 0.4) level = 1
    return level
  })

  const getCellColor = (level: number) => {
    switch (level) {
      case 3:
        return "bg-slate-400"
      case 2:
        return "bg-slate-600"
      case 1:
        return "bg-slate-800"
      default:
        return "bg-muted/30"
    }
  }

  return (
    <Card className="h-full border border-border/40 bg-card-surface-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
            <FolderCode className="h-4 w-4 text-muted-foreground" />
            GitHub Overview
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
        <CardDescription>Aggregated repository actions and activity stream.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        {/* Core Stats metrics grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-muted/10 p-3 text-center">
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">Contributions</span>
            <span className="text-base font-bold text-white mt-1 block">{stats.totalContributions}</span>
          </div>
          <div className="rounded-xl border border-border bg-muted/10 p-3 text-center">
            <Flame className="h-4 w-4 mx-auto text-slate-400 mb-1" />
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">Current Streak</span>
            <span className="text-base font-bold text-white mt-1 block">{stats.streak} Days</span>
          </div>
          <div className="rounded-xl border border-border bg-muted/10 p-3 text-center">
            <Flame className="h-4 w-4 mx-auto text-secondary mb-1" />
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">Longest Streak</span>
            <span className="text-base font-bold text-white mt-1 block">{stats.longestStreak} Days</span>
          </div>
        </div>

        {/* Contribution Graph Area (Intentionally styled for future embedding) */}
        <div className="space-y-2">
          <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">
            Contribution Graph Embed Slot
          </span>
          <div className="border border-border/40 bg-muted/5 rounded-xl p-3.5 flex flex-col justify-center">
            {/* 7 rows of 26 columns grid container */}
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
                <div className="h-2 w-2 rounded-[1px] bg-slate-800" />
                <div className="h-2 w-2 rounded-[1px] bg-slate-600" />
                <div className="h-2 w-2 rounded-[1px] bg-slate-400" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Language Distribution Bar */}
        <div className="space-y-2">
          <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">
            Most Used Languages
          </span>
          <div className="space-y-2 bg-muted/5 border border-border/40 p-3 rounded-xl">
            {/* Segmented Progress Bar */}
            <div className="h-2 w-full rounded-full overflow-hidden flex bg-muted/40">
              {stats.languages.map(lang => (
                <div
                  key={lang.name}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{ 
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color 
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>
            
            {/* Legend Labels Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
              {stats.languages.map(lang => (
                <div key={lang.name} className="flex items-center gap-1.5 min-w-0">
                  <span 
                    className="h-1.5 w-1.5 rounded-full shrink-0" 
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-white/90 font-medium truncate">{lang.name}</span>
                  <span className="text-muted-foreground ml-auto shrink-0 font-semibold">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Repositories */}
        <div className="space-y-2">
          <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">
            Recent Repositories
          </span>
          <div className="space-y-1.5">
            {stats.recentRepos.map(repo => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 w-full text-left rounded-xl border border-border/40 bg-muted/5 p-2.5 hover:bg-accent/40 transition-colors group outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block group-hover:text-primary transition-colors truncate">
                    {repo.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-none">
                    {repo.language}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-muted-foreground/70 font-semibold">
                  <Star className="h-3 w-3" />
                  <span>{repo.stars}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
