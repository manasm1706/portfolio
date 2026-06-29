import { FolderCode } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, Progress } from "@/components/ui"
import type { ActiveProject } from "@/data/mock/dashboard"

export interface ProjectProgressWidgetProps {
  projects: ActiveProject[]
}

export function ProjectProgressWidget({ projects }: ProjectProgressWidgetProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <FolderCode className="h-4 w-4 text-secondary" />
          Project Progress
        </CardTitle>
        <CardDescription>Visual tracker of build achievements.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        {projects.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-white text-sm block">
                  {project.name}
                </span>
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                  {project.category}
                </span>
              </div>
              <span className="font-bold text-secondary text-sm">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-1.5" indicatorClassName="bg-secondary" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
