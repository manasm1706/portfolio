import * as React from "react"
import { BookOpen, Search } from "lucide-react"

import { Input } from "@/components/ui"
import { MOCK_RESOURCES, type Resource } from "@/data/mock/resources"
import { ResourceCard } from "../components/ResourceCard"

type ResourceCategory = "All" | Resource["category"]

const CATEGORY_TABS: ResourceCategory[] = [
  "All",
  "DSA",
  "SQL",
  "System Design",
  "AI",
  "React",
  "Backend",
  "Android",
  "Unity",
  "Interview Prep"
]

export default function ResourcesPage() {
  const [resources, setResources] = React.useState<Resource[]>(MOCK_RESOURCES)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState<ResourceCategory>("All")

  // Live filter logic
  const filteredResources = React.useMemo(() => {
    return resources.filter(res => {
      const matchCategory = activeCategory === "All" || res.category === activeCategory
      const matchSearch = 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCategory && matchSearch
    })
  }, [resources, searchQuery, activeCategory])

  // In-memory status changer
  const handleStatusChange = (id: string, newStatus: Resource["status"]) => {
    setResources(prev =>
      prev.map(res =>
        res.id === id ? { ...res, status: newStatus } : res
      )
    )
  }

  // Count summaries
  const savedCount = resources.filter(r => r.status === "Saved").length
  const learningCount = resources.filter(r => r.status === "Learning").length
  const masteredCount = resources.filter(r => r.status === "Mastered").length

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Resources Library
          </h1>
          <p className="text-sm text-muted-foreground">
            Searchable learning syllabus, external guidelines, and personal notebooks.
          </p>
        </div>

        {/* Counter Summary Panel */}
        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider shrink-0 select-none">
          <div className="flex items-center gap-1.5 bg-muted/10 border border-border/40 px-2.5 py-1 rounded-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            <span>Saved: {savedCount}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/20 px-2.5 py-1 rounded-xl text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Learning: {learningCount}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-success/5 border border-success/20 px-2.5 py-1 rounded-xl text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span>Mastered: {masteredCount}</span>
          </div>
        </div>
      </div>

      {/* Control bar: Search + Category filters */}
      <div className="space-y-4">
        {/* Search Input Box */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            type="text"
            placeholder="Search by title, description, or #tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tab Filters scrollable bar */}
        <div className="flex flex-wrap gap-1.5 border-b border-border/40 pb-3">
          {CATEGORY_TABS.map(cat => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all outline-none ${
                  isActive
                    ? "border-primary bg-primary/10 text-white font-bold"
                    : "border-border/30 bg-card/40 text-muted-foreground hover:bg-muted/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Resources grid */}
      {filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/35 rounded-xl bg-card/5 min-h-[300px]">
          <BookOpen className="h-8 w-8 text-muted-foreground/30 mb-2 shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground">No matches found</span>
          <span className="text-[10px] text-muted-foreground/60 mt-1 max-w-sm leading-normal">
            No resources match category "{activeCategory}" with search term "{searchQuery}". Try modifying your filters.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(res => (
            <ResourceCard
              key={res.id}
              resource={res}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
