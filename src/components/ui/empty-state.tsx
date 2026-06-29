import * as React from "react"
import { cn } from "@/utils/cn"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  action?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon: Icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 p-8 text-center",
          className
        )}
        {...props}
      >
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-muted-foreground/80 mb-4">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-[340px] leading-relaxed">
          {description}
        </p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
