import { ExternalLink, CheckCircle2, Bookmark, Flame } from "lucide-react"
import { Card, Badge } from "@/components/ui"
import type { Resource } from "@/data/mock/resources"
import { cn } from "@/utils/cn"

export interface ResourceCardProps {
  resource: Resource
  onStatusChange: (id: string, status: Resource["status"]) => void
}

export function ResourceCard({ resource, onStatusChange }: ResourceCardProps) {
  // Get status color tokens
  const getStatusColor = (status: Resource["status"]) => {
    switch (status) {
      case "Saved":
        return "bg-muted/15 border-border/60 text-muted-foreground"
      case "Learning":
        return "bg-primary/10 border-primary/20 text-primary"
      case "Mastered":
        return "bg-success/10 border-success/20 text-success"
    }
  }

  // Get status icon
  const getStatusIcon = (status: Resource["status"]) => {
    switch (status) {
      case "Saved":
        return <Bookmark className="h-3 w-3" />
      case "Learning":
        return <Flame className="h-3 w-3" />
      case "Mastered":
        return <CheckCircle2 className="h-3 w-3" />
    }
  }

  return (
    <Card className="h-full flex flex-col justify-between hover:border-primary/20 transition-all duration-200 bg-card-surface-premium">
      <div className="p-5 space-y-3.5">
        {/* Header Category and Status Selector */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-muted/20 text-muted-foreground border-border/40 text-[9px] uppercase tracking-wider font-bold">
            {resource.category}
          </Badge>

          {/* Inline Status Tab Buttons */}
          <div className="flex items-center gap-1 border border-border/40 bg-muted/5 p-0.5 rounded-lg">
            {(["Saved", "Learning", "Mastered"] as const).map(s => {
              const isSelected = resource.status === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(resource.id, s)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer outline-none border border-transparent",
                    isSelected 
                      ? getStatusColor(s) + " font-black border-current/10" 
                      : "text-muted-foreground/50 hover:text-white"
                  )}
                >
                  {getStatusIcon(s)}
                  <span>{s}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-white leading-tight">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-3">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {resource.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border border-border/20 bg-muted/10 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="border-t border-border/30 p-3 px-5 bg-muted/5 flex items-center justify-end text-[10px]">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-semibold text-muted-foreground hover:text-white transition-colors"
        >
          <span>Open Resource</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Card>
  )
}
