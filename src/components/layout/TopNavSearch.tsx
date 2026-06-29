import * as React from "react"
import { Search, Command } from "lucide-react"
import { cn } from "@/utils/cn"
import { appConfig } from "@/config/app"

export interface TopNavSearchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function TopNavSearch({ className, ...props }: TopNavSearchProps) {
  const shortcut = appConfig.commandPaletteShortcut || "Ctrl+K"
  const isMac = typeof window !== "undefined" && window.navigator.userAgent.indexOf("Mac") !== -1
  const displayShortcut = isMac ? shortcut.replace("Ctrl", "⌘") : shortcut

  return (
    <button
      type="button"
      className={cn(
        "flex w-full max-w-[240px] items-center justify-between rounded-xl border border-border bg-popover px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/50 select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
        <span>Search or run...</span>
      </div>
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded-lg border border-border bg-card px-1.5 font-mono text-[9px] font-medium opacity-100 sm:flex">
        {isMac ? (
          <Command className="h-2 w-2" />
        ) : (
          <span className="text-[8px]">Ctrl</span>
        )}
        <span>{displayShortcut.split("+")[1] || "K"}</span>
      </kbd>
    </button>
  )
}
