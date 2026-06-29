import * as React from "react"
import { CheckSquare, Square } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui"
import type { TodayFocusItem } from "@/data/mock/dashboard"

export interface TodayFocusWidgetProps {
  initialTasks: TodayFocusItem[]
}

export function TodayFocusWidget({ initialTasks }: TodayFocusWidgetProps) {
  const [tasks, setTasks] = React.useState<TodayFocusItem[]>(initialTasks)

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
            Today's Focus
          </CardTitle>
          <span className="text-xs font-medium text-success">
            {completedCount}/{tasks.length} Done
          </span>
        </div>
        <CardDescription>Click to mark items as complete for today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggleTask(task.id)}
            className="flex items-start gap-3 w-full text-left rounded-lg p-2 hover:bg-accent/40 transition-colors cursor-pointer group outline-none focus-visible:ring-1 focus-visible:ring-success"
          >
            <div className="shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors">
              {task.completed ? (
                <CheckSquare className="h-4 w-4 text-success" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </div>
            <span
              className={`text-sm transition-all duration-150 leading-snug ${
                task.completed
                  ? "text-muted-foreground/60 line-through decoration-muted-foreground/40"
                  : "text-white"
              }`}
            >
              {task.text}
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
