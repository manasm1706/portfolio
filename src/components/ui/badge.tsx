import * as React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info"
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border transition-colors duration-150",
          {
            // Default (Primary accent variant)
            "bg-primary/10 text-primary border-primary/20": variant === "default",
            // Secondary (AI/highlights variant)
            "bg-secondary/10 text-secondary border-secondary/20": variant === "secondary",
            // Success
            "bg-success/10 text-success border-success/20": variant === "success",
            // Warning
            "bg-warning/10 text-warning border-warning/20": variant === "warning",
            // Error
            "bg-danger/10 text-danger border-danger/20": variant === "error",
            // Info (Muted gray variant)
            "bg-muted/50 text-muted-foreground border-border": variant === "info",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
