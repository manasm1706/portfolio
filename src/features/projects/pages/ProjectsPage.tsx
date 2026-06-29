import { FolderCode, Cpu, History } from "lucide-react"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui"
import { 
  MOCK_FEATURED_PROJECT, 
  MOCK_ACTIVE_PROJECTS, 
  MOCK_COMPLETED_PROJECTS, 
  MOCK_TECH_STACK, 
  MOCK_RECENTLY_UPDATED 
} from "@/data/mock/projects"
import { FeaturedProjectCard } from "../components/FeaturedProjectCard"
import { ProjectCard } from "../components/ProjectCard"

export default function ProjectsPage() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-12">
      {/* Page Header */}
      <div className="border-b border-border/40 pb-4 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <FolderCode className="h-6 w-6 text-secondary" />
          Projects Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Workspace registry and performance status of software developments.
        </p>
      </div>

      {/* Row 1: Featured Project (65%) & Tech/Updated Stack (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1fr] gap-6 items-stretch">
        <div>
          <FeaturedProjectCard project={MOCK_FEATURED_PROJECT} />
        </div>
        <div className="flex flex-col gap-6">
          {/* Tech Stack Overview */}
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-secondary" />
                  Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {MOCK_TECH_STACK.map(group => (
                  <div key={group.category} className="space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider block">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {group.items.map(tech => (
                        <span 
                          key={tech} 
                          className="inline-flex items-center rounded-lg bg-muted/20 border border-border/30 px-2 py-0.5 text-[10px] text-white/95 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recently Updated */}
          <div className="flex-1">
            <Card className="h-full">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                  <History className="h-4 w-4 text-secondary" />
                  Recently Updated
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2.5">
                {MOCK_RECENTLY_UPDATED.map(item => (
                  <div 
                    key={item.name} 
                    className="flex items-center justify-between gap-3 border-b border-border/20 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground leading-none">
                        {item.repo}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/80 font-semibold shrink-0">
                      {item.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Row 2: Active Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/20 pb-2">
          <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warning inline-block" />
            Active Builds
          </span>
          <span className="text-[10px] font-bold text-muted-foreground/50">
            {MOCK_ACTIVE_PROJECTS.length} Projects
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_ACTIVE_PROJECTS.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Row 3: Completed Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/20 pb-2">
          <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success inline-block" />
            Completed Archives
          </span>
          <span className="text-[10px] font-bold text-muted-foreground/50">
            {MOCK_COMPLETED_PROJECTS.length} Systems
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_COMPLETED_PROJECTS.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
