import { Play, FolderCode, FileText, Shield, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui"
import type { ContinueWorkItem } from "@/data/mock/dashboard"

export interface ContinueWorkingWidgetProps {
  items: ContinueWorkItem[]
}

export function ContinueWorkingWidget({ items }: ContinueWorkingWidgetProps) {
  const getIcon = (iconName: ContinueWorkItem["iconName"]) => {
    switch (iconName) {
      case "FolderCode":
        return <FolderCode className="h-4 w-4 text-secondary" />
      case "FileText":
        return <FileText className="h-4 w-4 text-primary" />
      case "Shield":
        return <Shield className="h-4 w-4 text-success" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <Play className="h-4 w-4 text-primary" />
          Continue working
        </CardTitle>
        <CardDescription>Quick resume where you left off.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => alert(`Resuming build on ${item.name}`)}
            className="flex items-center justify-between gap-3 w-full text-left rounded-xl border border-border/40 bg-muted/5 p-2.5 hover:bg-accent hover:border-accent transition-all cursor-pointer group outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {getIcon(item.iconName)}
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  {item.name}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none">
                  {item.timeAgo}
                </span>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/35 group-hover:translate-x-0.5 group-hover:text-white transition-all shrink-0" />
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
