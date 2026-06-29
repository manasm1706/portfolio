import { ExternalLink, FolderCode, Code2, Calendar, FileText, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui"
import type { QuickLink } from "@/data/mock/dashboard"

export interface QuickLinksWidgetProps {
  links: QuickLink[]
}

export function QuickLinksWidget({ links }: QuickLinksWidgetProps) {
  const getIcon = (iconName: QuickLink["iconName"]) => {
    switch (iconName) {
      case "Github":
        return <FolderCode className="h-4 w-4" />
      case "Code2":
        return <Code2 className="h-4 w-4" />
      case "Calendar":
        return <Calendar className="h-4 w-4" />
      case "FileText":
        return <FileText className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-primary" />
          Quick Links
        </CardTitle>
        <CardDescription>Raycast-style shortcut rows.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-0">
        {links.map((link) => (
          <button
            key={link.name}
            type="button"
            onClick={() => alert(`Navigating to ${link.name} (Shortcut: ${link.shortcut})`)}
            className="flex items-center justify-between gap-3 w-full text-left rounded-xl border border-border/40 bg-muted/5 p-2.5 hover:bg-accent hover:border-accent transition-all cursor-pointer group outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                {getIcon(link.iconName)}
              </div>
              <span className="text-sm font-medium text-white group-hover:text-white transition-colors">
                {link.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Keyboard shortcut tag */}
              <kbd className="pointer-events-none select-none flex h-5 items-center gap-0.5 rounded border border-border bg-card px-1.5 font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground/50 group-hover:border-muted-foreground/30">
                {link.shortcut}
              </kbd>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/35 group-hover:translate-x-0.5 group-hover:text-white transition-all duration-150 shrink-0" />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
