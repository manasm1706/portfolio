import * as React from "react"
import { cn } from "@/utils/cn"

export interface SidebarSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
}

export function SidebarSectionHeader({ className, label, ...props }: SidebarSectionHeaderProps) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 select-none",
        className
      )}
      {...props}
    >
      {label}
    </div>
  )
}
