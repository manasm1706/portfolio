import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/utils/cn"

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  isActive?: boolean
  badge?: string | number
  isCollapsed?: boolean
}

export function SidebarItem({
  className,
  to,
  icon: Icon,
  label,
  isActive = false,
  badge,
  isCollapsed = false,
  ...props
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary select-none group",
        isCollapsed ? "justify-center h-10 w-10 p-0 mx-auto" : "justify-between w-full",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-150",
            isActive ? "text-primary" : "text-muted-foreground group-hover:scale-105 group-hover:text-foreground"
          )}
        />
        {!isCollapsed && <span>{label}</span>}
      </div>
      {!isCollapsed && badge !== undefined && (
        <span
          className={cn(
            "inline-flex h-5 items-center justify-center rounded-md px-1.5 text-[10px] font-medium border transition-colors",
            isActive
              ? "bg-primary/20 text-primary border-primary/20"
              : "bg-muted text-muted-foreground border-border group-hover:border-muted-foreground/30"
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}
