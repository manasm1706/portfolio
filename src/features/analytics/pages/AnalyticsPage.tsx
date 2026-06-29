import { TrendingUp, Compass, FolderCode, Hourglass, Activity } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui"
import { 
  MOCK_MONTHLY_SOLVES, 
  MOCK_PROJECT_ACTIVITIES, 
  MOCK_PIPELINE_STAGES, 
  MOCK_STUDY_HOURS, 
  MOCK_REFLECTION 
} from "@/data/mock/analytics"
import { SvgLineChart } from "../components/SvgLineChart"
import { ReflectionCard } from "../components/ReflectionCard"

export default function AnalyticsPage() {
  const totalStudyHours = MOCK_STUDY_HOURS.reduce((acc, h) => acc + h.hours, 0)

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Analytics Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Identify trends, monitor project activities, and track career alignment indexes.
        </p>
      </div>

      {/* Top Row: Problems Solved Trend & Opportunity Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problems Solved Line Chart */}
        <Card className="lg:col-span-2 border border-border/40 bg-card-surface-premium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Problems Solved Trend
            </CardTitle>
            <CardDescription>
              Am I solving more problems than last month? (LeetCode cumulative solved counts)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <SvgLineChart data={MOCK_MONTHLY_SOLVES} />
          </CardContent>
        </Card>

        {/* Opportunity Pipeline Conversion Funnel */}
        <Card className="border border-border/40 bg-card-surface-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
              <Compass className="h-4 w-4 text-warning" />
              Opportunity Pipeline
            </CardTitle>
            <CardDescription>
              Where am I in the application funnel?
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-4">
              {MOCK_PIPELINE_STAGES.map(item => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">{item.stage}</span>
                    <span className="text-white font-bold">{item.count}</span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${(item.count / 3) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row: Study Distribution & Project Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Hours Distribution */}
        <Card className="border border-border/40 bg-card-surface-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
              <Hourglass className="h-4 w-4 text-primary" />
              Study Distribution
            </CardTitle>
            <CardDescription>
              What topics am I prioritizing or neglecting? (Total: {totalStudyHours}h study logged)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-3.5">
              {MOCK_STUDY_HOURS.map(item => {
                const percentage = Math.round((item.hours / totalStudyHours) * 100)
                return (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white/90 truncate max-w-[220px]">{item.subject}</span>
                      <span className="text-muted-foreground shrink-0">{item.hours}h ({percentage}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Project Activity status */}
        <Card className="border border-border/40 bg-card-surface-premium">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
              <FolderCode className="h-4 w-4 text-primary" />
              Project Activity
            </CardTitle>
            <CardDescription>
              Which repositories are receiving active updates?
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-3">
              {MOCK_PROJECT_ACTIVITIES.map(item => (
                <div 
                  key={item.name} 
                  className="flex items-center justify-between border border-border/40 bg-muted/5 p-3 rounded-xl hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="h-2 w-2 rounded-full" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-xs font-semibold text-white">{item.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-0.5 rounded-md border border-border/30 bg-muted/10">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Monthly Reflection Card */}
      <div className="grid grid-cols-1 gap-6">
        <ReflectionCard reflection={MOCK_REFLECTION} />
      </div>
    </div>
  )
}
