import { Calendar, AlertCircle, Video, UserCheck } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui"
import type { UpcomingEvent } from "@/data/mock/dashboard"

export interface UpcomingEventsWidgetProps {
  events: UpcomingEvent[]
}

export function UpcomingEventsWidget({ events }: UpcomingEventsWidgetProps) {
  const getIcon = (type: UpcomingEvent["type"]) => {
    switch (type) {
      case "deadline":
        return <AlertCircle className="h-4 w-4 text-danger" />
      case "meeting":
        return <Video className="h-4 w-4 text-primary" />
      case "interview":
        return <UserCheck className="h-4 w-4 text-secondary" />
    }
  }

  const getBadgeStyle = (type: UpcomingEvent["type"]) => {
    switch (type) {
      case "deadline":
        return "bg-danger/10 text-danger border-danger/10"
      case "meeting":
        return "bg-primary/10 text-primary border-primary/10"
      case "interview":
        return "bg-secondary/10 text-secondary border-secondary/10"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-warning" />
          Upcoming events
        </CardTitle>
        <CardDescription>Chronological timeline and deadlines.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3.5 pt-0">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between gap-3 border border-border/40 bg-muted/10 p-3 rounded-xl hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${getBadgeStyle(event.type)}`}>
                {getIcon(event.type)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {event.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {event.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
