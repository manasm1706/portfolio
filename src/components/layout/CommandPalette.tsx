import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Command } from "cmdk"
import { Search } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { NAVIGATION_ITEMS } from "@/config/navigation"
import { useCommandPaletteStore } from "@/store/useCommandPaletteStore"

export function CommandPalette() {
  const { isOpen, setOpen } = useCommandPaletteStore()
  const navigate = useNavigate()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!isOpen)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, setOpen])

  const handleSelect = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const groups = React.useMemo(() => {
    const map: Record<string, typeof NAVIGATION_ITEMS> = {}
    NAVIGATION_ITEMS.filter(item => item.searchable).forEach((item) => {
      const g = item.group || "Other"
      if (!map[g]) map[g] = []
      map[g].push(item)
    })
    return Object.entries(map)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-xl overflow-hidden bg-popover border-border">
        <Command className="flex h-full w-full flex-col overflow-hidden text-foreground bg-transparent font-sans">
          {/* Search Input wrapper */}
          <div className="flex items-center border-b border-border px-4 py-3 gap-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground/80" />
            <Command.Input
              placeholder="Search pages or run actions..."
              className="flex h-6 w-full bg-transparent text-sm text-white placeholder:text-muted-foreground/60 outline-none border-none focus:ring-0 focus:outline-none"
            />
          </div>

          <Command.List className="max-h-[320px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-8 text-center text-xs text-muted-foreground">
              No results found.
            </Command.Empty>

            {groups.map(([groupName, items]) => (
              <Command.Group 
                key={groupName} 
                heading={groupName} 
                className="px-2 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider"
              >
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Command.Item
                      key={item.path}
                      value={item.name}
                      onSelect={() => handleSelect(item.path)}
                      className="flex cursor-pointer select-none items-center rounded-lg px-2.5 py-2 text-sm text-muted-foreground outline-none transition-colors data-[selected=true]:bg-accent data-[selected=true]:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 gap-3 mt-1 normal-case font-medium"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground/80" />
                      <span className="text-white">{item.name}</span>
                      {item.shortcut && (
                        <kbd className="ml-auto pointer-events-none select-none flex h-5 items-center gap-0.5 rounded border border-border bg-card px-1.5 font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
                          {item.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  )
                })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
