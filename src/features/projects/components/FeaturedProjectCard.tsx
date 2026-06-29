import { FolderCode, FileText, Layout, Play, Clock, Sparkles } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, Badge } from "@/components/ui"
import type { Project } from "@/data/mock/projects"

export interface FeaturedProjectCardProps {
  project: Project
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  // Map link icon
  const getLinkIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "github":
        return <FolderCode className="h-3.5 w-3.5" />
      case "documentation":
        return <FileText className="h-3.5 w-3.5" />
      case "design":
        return <Layout className="h-3.5 w-3.5" />
      case "live demo":
        return <Play className="h-3.5 w-3.5" />
      default:
        return <Play className="h-3.5 w-3.5" />
    }
  }

  return (
    <Card variant="elevated" className="h-full border border-primary/20 bg-card-surface-elevated-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            Featured Build
          </span>
          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 uppercase tracking-wider text-[9px] font-bold">
            {project.statusLabel}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-white mt-1.5">
          {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-xs text-muted-foreground/95 leading-relaxed">
          {project.description}
        </p>

        {/* Phase details */}
        {project.phase && (
          <div className="text-xs bg-muted/15 border border-border/40 p-2.5 rounded-xl space-y-1">
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Current Phase</span>
            <p className="text-white font-medium">{project.phase}</p>
          </div>
        )}

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] uppercase font-semibold">
            <span className="text-muted-foreground">Overall Build Progress</span>
            <span className="text-secondary font-bold">{project.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider block">Tech Stack</span>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map(tech => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-white/90"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links & Last Updated */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/40 text-[10px] text-muted-foreground/80 font-semibold">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground/65" />
            <span>Updated {project.lastUpdated}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {project.links.map(link => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-white transition-colors"
              >
                {getLinkIcon(link.name)}
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
