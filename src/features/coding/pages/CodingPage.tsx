import { 
  Flame, 
  Code2, 
  GitFork, 
  Trophy, 
  GitMerge, 
  Activity, 
  ExternalLink,
  ArrowRight
} from "lucide-react"

import { Card, CardHeader, CardContent, CardTitle, MetricCard } from "@/components/ui"
import { 
  MOCK_GITHUB_STATS, 
  MOCK_LEETCODE_STATS, 
  MOCK_FOCUS_AREAS, 
  MOCK_SHORTCUT_LINKS 
} from "@/data/mock/coding"
import { GithubStatsCard } from "../components/GithubStatsCard"
import { LeetcodeStatsCard } from "../components/LeetcodeStatsCard"

export default function CodingPage() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-12">
      {/* Page Header */}
      <div className="border-b border-border/40 pb-4 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Coding Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform progress indicators, algorithms study logs, and repository tracking.
        </p>
      </div>

      {/* Row 1: Key Performance Metrics Row (5 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          title="GitHub Streak"
          value={`${MOCK_GITHUB_STATS.streak} Days`}
          icon={Flame}
        />
        <MetricCard
          title="LeetCode Solved"
          value={MOCK_LEETCODE_STATS.solvedCount.total}
          icon={Code2}
        />
        <MetricCard
          title="Repositories"
          value={MOCK_GITHUB_STATS.totalRepos}
          icon={GitFork}
        />
        <MetricCard
          title="Hackathons"
          value={5}
          icon={Trophy}
        />
        <MetricCard
          title="Open Source"
          value={2}
          icon={GitMerge}
        />
      </div>

      {/* Row 2: Platform Profiles (Asymmetric split: Left 60% GitHub / Right 40% LeetCode) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch">
        <div>
          <GithubStatsCard stats={MOCK_GITHUB_STATS} />
        </div>
        <div>
          <LeetcodeStatsCard stats={MOCK_LEETCODE_STATS} />
        </div>
      </div>

      {/* Row 3: Current Focus (Left 50%) & Shortcuts (Right 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Focus Areas */}
        <Card className="h-full border border-border/40 bg-card-surface-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Current Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {MOCK_FOCUS_AREAS.map(focus => (
              <div key={focus.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{focus.name}</span>
                  <span className="text-primary font-bold">{focus.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${focus.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shortcut Links */}
        <Card className="h-full border border-border/40 bg-card-surface-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              Useful Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0">
            {MOCK_SHORTCUT_LINKS.map(link => {
              const content = (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                    {link.name}
                  </span>
                  {!link.isPlaceholder ? (
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0" />
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground/40 bg-muted/20 border border-border/40 rounded px-1.5 py-0.5">
                      TBD
                    </span>
                  )}
                </div>
              )

              if (link.isPlaceholder) {
                return (
                  <div
                    key={link.name}
                    className="flex items-center justify-between gap-3 w-full rounded-xl border border-border/30 bg-muted/5 p-3 text-muted-foreground cursor-not-allowed select-none opacity-50"
                  >
                    {content}
                  </div>
                )
              }

              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 w-full rounded-xl border border-border/40 bg-muted/5 p-3 hover:bg-accent/40 transition-colors group outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  {content}
                </a>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
