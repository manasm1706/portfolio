import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckSquare, Square, ExternalLink, Sparkles } from "lucide-react"
import type { Opportunity } from "@/data/mock/opportunities"

export interface OpportunityDetailsDialogProps {
  opportunity: Opportunity | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleCheck: (oppId: string, checkId: string) => void
}

export function OpportunityDetailsDialog({ opportunity, open, onOpenChange, onToggleCheck }: OpportunityDetailsDialogProps) {
  if (!opportunity) return null

  const completedChecklist = opportunity.checklist.filter(item => item.completed).length
  const totalChecklist = opportunity.checklist.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
            <span>{opportunity.category}</span>
            <span>•</span>
            <span>{opportunity.company}</span>
          </div>
          <DialogTitle className="text-xl font-bold text-white leading-tight">
            {opportunity.title}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Deadline: {opportunity.deadline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Description Block */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Overview
            </span>
            <p className="text-sm text-muted-foreground/90 leading-relaxed bg-muted/5 border border-border/40 p-3 rounded-xl">
              {opportunity.description}
            </p>
          </div>

          {/* Core Skills Tags */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Key Skills
            </span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {opportunity.skills.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-lg border border-border bg-muted/20 px-2.5 py-1 text-xs font-semibold text-white/95"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Prep checklist */}
          {totalChecklist > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>Preparation Checklist</span>
                <span className="text-primary font-bold">
                  {completedChecklist}/{totalChecklist} Done
                </span>
              </span>
              <div className="space-y-1.5">
                {opportunity.checklist.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleCheck(opportunity.id, item.id)}
                    className="flex items-start gap-3 w-full text-left rounded-xl border border-border/40 bg-muted/5 p-3 hover:bg-accent/40 transition-colors cursor-pointer group outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <div className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.completed ? (
                        <CheckSquare className="h-4 w-4 text-success" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs transition-all duration-150 leading-relaxed ${
                        item.completed
                          ? "text-muted-foreground/60 line-through decoration-muted-foreground/40"
                          : "text-white"
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Experience Notes */}
          <div className="space-y-2 pt-1 border-t border-border/40">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-400" />
              Strategic Notes
            </span>
            <p className="text-xs text-muted-foreground/80 bg-orange-400/5 border border-orange-400/10 p-3 rounded-xl leading-relaxed">
              {opportunity.notes}
            </p>
          </div>
        </div>

        <DialogFooter className="pt-2">
          {opportunity.externalUrl && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => window.open(opportunity.externalUrl, "_blank")}
              className="mr-auto gap-2 cursor-pointer text-xs"
            >
              <ExternalLink className="h-4 w-4" />
              Project Repository
            </Button>
          )}
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer font-bold bg-primary text-black hover:bg-primary/90"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
