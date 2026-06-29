import * as React from "react"
import { Briefcase, Trophy, GitMerge } from "lucide-react"

import { Badge } from "@/components/ui"
import { MOCK_OPPORTUNITIES, type Opportunity } from "@/data/mock/opportunities"
import { OpportunityCard } from "../components/OpportunityCard"
import { OpportunityDetailsDialog } from "../components/OpportunityDetailsDialog"

type CategoryFilter = "all" | "internship" | "hackathon" | "open-source"

const CATEGORIES = [
  { id: "all", label: "All items" },
  { id: "internship", label: "Internships", icon: Briefcase },
  { id: "hackathon", label: "Hackathons", icon: Trophy },
  { id: "open-source", label: "Open Source", icon: GitMerge }
]

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>(MOCK_OPPORTUNITIES)
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>("all")
  
  // Selected opportunity for details dialog
  const [selectedOppId, setSelectedOppId] = React.useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)

  // Filter opportunities by category
  const filteredOpps = React.useMemo(() => {
    if (activeCategory === "all") return opportunities
    return opportunities.filter(opp => opp.category === activeCategory)
  }, [opportunities, activeCategory])

  // Group by status
  const targetOpps = React.useMemo(() => filteredOpps.filter(o => o.status === "Target"), [filteredOpps])
  const inProgressOpps = React.useMemo(() => filteredOpps.filter(o => o.status === "In Progress"), [filteredOpps])
  const completedOpps = React.useMemo(() => filteredOpps.filter(o => o.status === "Completed"), [filteredOpps])

  // Fetch currently selected opportunity details
  const selectedOpportunity = React.useMemo(() => {
    return opportunities.find(o => o.id === selectedOppId) || null
  }, [opportunities, selectedOppId])

  // Handle toggle checklist task in-memory
  const handleToggleChecklistTask = (oppId: string, taskId: string) => {
    setOpportunities(prev =>
      prev.map(opp => {
        if (opp.id !== oppId) return opp
        return {
          ...opp,
          checklist: opp.checklist.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        }
      })
    )
  }

  const handleCardClick = (id: string) => {
    setSelectedOppId(id)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Opportunities
          </h1>
          <p className="text-sm text-muted-foreground">
            Track internships, hackathons, and prep checklists in one registry.
          </p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-4">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as CategoryFilter)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all outline-none ${
                isActive
                  ? "border-primary bg-primary/10 text-white font-bold"
                  : "border-border/30 bg-card/40 text-muted-foreground hover:bg-muted/10 hover:text-white"
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Kanban Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Target */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary inline-block" />
              Target / Backlog
            </span>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/10 font-bold">
              {targetOpps.length}
            </Badge>
          </div>

          <div className="space-y-4 min-h-[150px]">
            {targetOpps.length === 0 ? (
              <div className="p-8 border border-dashed border-border/30 rounded-xl bg-card/10 text-center text-xs text-muted-foreground/60">
                No target opportunities
              </div>
            ) : (
              targetOpps.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onClick={() => handleCardClick(opp.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-warning inline-block" />
              In Preparation
            </span>
            <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/10 font-bold">
              {inProgressOpps.length}
            </Badge>
          </div>

          <div className="space-y-4 min-h-[150px]">
            {inProgressOpps.length === 0 ? (
              <div className="p-8 border border-dashed border-border/30 rounded-xl bg-card/10 text-center text-xs text-muted-foreground/60">
                No active preps
              </div>
            ) : (
              inProgressOpps.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onClick={() => handleCardClick(opp.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success inline-block" />
              Completed
            </span>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/10 font-bold">
              {completedOpps.length}
            </Badge>
          </div>

          <div className="space-y-4 min-h-[150px]">
            {completedOpps.length === 0 ? (
              <div className="p-8 border border-dashed border-border/30 rounded-xl bg-card/10 text-center text-xs text-muted-foreground/60">
                No completed records
              </div>
            ) : (
              completedOpps.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onClick={() => handleCardClick(opp.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <OpportunityDetailsDialog
        opportunity={selectedOpportunity}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onToggleCheck={handleToggleChecklistTask}
      />
    </div>
  )
}
