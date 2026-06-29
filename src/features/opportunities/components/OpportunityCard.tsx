import { Briefcase, Trophy, GitMerge, ExternalLink } from "lucide-react"
import { Card, Badge } from "@/components/ui"
import type { Opportunity } from "@/data/mock/opportunities"
import { cn } from "@/utils/cn"

export interface OpportunityCardProps {
  opportunity: Opportunity
  onClick: () => void
}

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  // Category Icons & colors
  const getCategoryDetails = (category: Opportunity["category"]) => {
    switch (category) {
      case "internship":
        return {
          icon: <Briefcase className="h-4 w-4 text-secondary" />,
          label: "Internship"
        }
      case "hackathon":
        return {
          icon: <Trophy className="h-4 w-4 text-orange-400" />,
          label: "Hackathon"
        }
      case "open-source":
        return {
          icon: <GitMerge className="h-4 w-4 text-primary" />,
          label: "Open Source"
        }
    }
  }

  // Status Badge classes
  const getStatusBadgeStyle = (status: Opportunity["status"]) => {
    switch (status) {
      case "Target":
        return "bg-primary/10 text-primary border-primary/10"
      case "In Progress":
        return "bg-warning/10 text-warning border-warning/10"
      case "Completed":
        return "bg-success/10 text-success border-success/10"
      case "Closed":
        return "bg-danger/10 text-danger border-danger/10"
    }
  }

  const catDetails = getCategoryDetails(opportunity.category)
  const completedChecklist = opportunity.checklist.filter(item => item.completed).length
  const totalChecklist = opportunity.checklist.length

  return (
    <Card
      variant="interactive"
      onClick={onClick}
      className="flex flex-col justify-between h-full hover:border-primary/20 transition-all duration-200"
    >
      <div className="p-5 space-y-4">
        {/* Header Category and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80">
            {catDetails.icon}
            <span>{catDetails.label}</span>
          </div>
          <Badge
            variant="secondary"
            className={cn("border select-none uppercase tracking-wider text-[9px] font-bold shrink-0", getStatusBadgeStyle(opportunity.status))}
          >
            {opportunity.statusLabel}
          </Badge>
        </div>

        {/* Title and Company */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-tight">
            {opportunity.title}
          </h3>
          <p className="text-xs font-semibold text-muted-foreground">
            {opportunity.company}
          </p>
        </div>

        {/* Readiness Bars */}
        {opportunity.status !== "Completed" && (
          <div className="space-y-2.5 pt-1">
            {/* DSA Readiness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-semibold">
                <span className="text-muted-foreground/80">DSA Preparation</span>
                <span className="text-white font-bold">{opportunity.dsaReadiness}%</span>
              </div>
              <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${opportunity.dsaReadiness}%` }}
                />
              </div>
            </div>

            {/* Projects Readiness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-semibold">
                <span className="text-muted-foreground/80">Projects Readiness</span>
                <span className="text-white font-bold">{opportunity.projectsReadiness}%</span>
              </div>
              <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all"
                  style={{ width: `${opportunity.projectsReadiness}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Brief description */}
        <p className="text-xs text-muted-foreground/85 line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="border-t border-border/40 p-4 px-5 bg-muted/5 flex items-center justify-between text-[10px] text-muted-foreground/75 font-semibold">
        <span>Deadline: {opportunity.deadline}</span>
        <div className="flex items-center gap-3">
          {totalChecklist > 0 && (
            <span>
              {completedChecklist}/{totalChecklist} Tasks
            </span>
          )}
          {opportunity.externalUrl && (
            <a
              href={opportunity.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-white transition-colors"
              aria-label={`View external project link for ${opportunity.title}`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
