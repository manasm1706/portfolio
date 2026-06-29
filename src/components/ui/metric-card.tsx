import * as React from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/utils/cn"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: string | number
    isPositive: boolean
  }
  icon?: React.ComponentType<{ className?: string }>
  progress?: number // 0 to 100 (renders a progress bar if present)
  variant?: "default" | "elevated" | "interactive"
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, title, value, description, trend, icon: Icon, progress, variant = "default", ...props }, ref) => {
    return (
      <Card ref={ref} variant={variant} className={cn("overflow-hidden", className)} {...props}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </span>
            {Icon && (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/40 bg-muted/30 text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border",
                  trend.isPositive
                    ? "bg-success/10 text-success border-success/10"
                    : "bg-danger/10 text-danger border-danger/10"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {trend.value}
              </span>
            )}
          </div>

          {(description || progress !== undefined) && (
            <div className="mt-4 space-y-3">
              {progress !== undefined && (
                <Progress value={progress} className="h-1.5" />
              )}
              {description && (
                <p className="text-xs text-muted-foreground/80 leading-normal">
                  {description}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)
MetricCard.displayName = "MetricCard"

export { MetricCard }
