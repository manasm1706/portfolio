import * as React from "react"
import { cn } from "@/utils/cn"

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-border/40 mb-6",
          className
        )}
        {...props}
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground max-w-[600px]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    )
  }
)
PageHeader.displayName = "PageHeader"

export { PageHeader }
