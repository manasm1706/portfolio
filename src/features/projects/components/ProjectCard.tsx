import { FolderCode, Play, Trophy, Clock, CheckCircle } from "lucide-react"
import { Card, CardTitle, Badge } from "@/components/ui"
import type { Project } from "@/data/mock/projects"
import { cn } from "@/utils/cn"

export interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isCompleted = project.status === "Completed"

  return (
    <Card variant="interactive" className="h-full flex flex-col justify-between hover:border-secondary/35 transition-all duration-200">
      <div className="p-5 space-y-4">
        {/* Header Title and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold text-white leading-tight">
              {project.title}
            </CardTitle>
            <span className="text-[10px] text-muted-foreground block font-semibold">
              {isCompleted ? "Completed Build" : "Active Project"}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "uppercase tracking-wider text-[9px] font-bold shrink-0 border select-none",
              isCompleted
                ? "bg-success/10 text-success border-success/15"
                : "bg-warning/10 text-warning border-warning/15"
            )}
          >
            {project.statusLabel}
          </Badge>
        </div>

        {/* Short Description */}
        <p className="text-xs text-muted-foreground/90 leading-relaxed">
          {project.description}
        </p>

        {/* Special Achievement banner for completed items */}
        {isCompleted && project.achievement && (
          <div className="flex items-center gap-1.5 rounded-lg border border-success/15 bg-success/5 p-2 text-[10px] font-semibold text-success leading-none">
            <Trophy className="h-3.5 w-3.5 shrink-0" />
            <span>{project.achievement}</span>
          </div>
        )}

        {/* Progress Bar for Active projects */}
        {!isCompleted && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] uppercase font-semibold">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-secondary font-bold">{project.progress}%</span>
            </div>
            <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {project.technologies.slice(0, 4).map(tech => (
            <span
              key={tech}
              className="inline-flex items-center rounded-md border border-border bg-muted/20 px-1.5 py-0.5 text-[9px] font-medium text-white/80"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-[9px] text-muted-foreground font-semibold px-0.5 self-center">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-border/40 p-4 px-5 bg-muted/5 flex items-center justify-between text-[10px] text-muted-foreground/75 font-semibold">
        <div className="flex items-center gap-1">
          {isCompleted ? (
            <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
          ) : (
            <Clock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          )}
          <span className="truncate max-w-[120px]">{project.lastUpdated}</span>
        </div>

        <div className="flex items-center gap-2">
          {project.links.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground hover:text-white transition-colors"
            >
              {link.name.toLowerCase() === "github" ? (
                <FolderCode className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </Card>
  )
}
