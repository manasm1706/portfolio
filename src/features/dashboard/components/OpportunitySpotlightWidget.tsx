import { Briefcase, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Progress, Badge } from "@/components/ui"
import type { SpotlightOpportunity } from "@/data/mock/dashboard"

export interface OpportunitySpotlightWidgetProps {
  opportunity: SpotlightOpportunity
}

export function OpportunitySpotlightWidget({ opportunity }: OpportunitySpotlightWidgetProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-orange-400" />
            Opportunity Spotlight
          </CardTitle>
          <Badge variant="secondary" className="bg-orange-400/10 text-orange-400 border-orange-400/20 shrink-0">
            Hackathon
          </Badge>
        </div>
        <CardDescription>Target track recommendation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Opportunity Card Info */}
        <div className="border border-border/40 bg-muted/15 p-4 rounded-xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-white">
                {opportunity.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {opportunity.deadline}
              </p>
            </div>
            <Link 
              to="/opportunities" 
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-popover text-muted-foreground hover:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label="View opportunity details"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-2.5 pt-1.5">
            {/* DSA Readiness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-semibold">
                <span className="text-muted-foreground">DSA Readiness</span>
                <span className="text-white">{opportunity.dsaReadiness}%</span>
              </div>
              <Progress value={opportunity.dsaReadiness} className="h-1 bg-muted/50" indicatorClassName="bg-orange-400" />
            </div>

            {/* Projects Readiness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] uppercase font-semibold">
                <span className="text-muted-foreground">Projects Readiness</span>
                <span className="text-white">{opportunity.projectsReadiness}%</span>
              </div>
              <Progress value={opportunity.projectsReadiness} className="h-1 bg-muted/50" indicatorClassName="bg-orange-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
