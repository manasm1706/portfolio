import * as React from "react"
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CalendarDays, 
  Clock, 
  AlertCircle, 
  Video, 
  UserCheck, 
  CheckCircle2, 
  Circle 
} from "lucide-react"

import { Card, CardHeader, CardContent, CardTitle, CardDescription, Button } from "@/components/ui"
import { MOCK_CALENDAR_EVENTS, type CalendarEvent } from "@/data/mock/calendar"
import { CalendarGrid } from "../components/CalendarGrid"
import { EventDialog } from "../components/EventDialog"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [events, setEvents] = React.useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  // Filters
  const [filterDeadlines, setFilterDeadlines] = React.useState(true)
  const [filterMeetings, setFilterMeetings] = React.useState(true)
  const [filterInterviews, setFilterInterviews] = React.useState(true)

  // Month navigation logic
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleGoToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Filter events
  const filteredEvents = React.useMemo(() => {
    return events.filter(event => {
      if (event.type === "deadline" && !filterDeadlines) return false
      if (event.type === "meeting" && !filterMeetings) return false
      if (event.type === "interview" && !filterInterviews) return false
      return true
    })
  }, [events, filterDeadlines, filterMeetings, filterInterviews])

  // Get active agenda events for selected day
  const selectedDayEvents = React.useMemo(() => {
    return filteredEvents.filter(event => {
      const d = new Date(event.date)
      return (
        d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      )
    })
  }, [filteredEvents, selectedDate])

  // Month display label e.g. "June 2026"
  const monthYearLabel = React.useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    })
  }, [currentDate])

  // Add event handler
  const handleAddEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${events.length + 1}`
    }
    setEvents(prev => [...prev, newEvent])
  }

  // Toggle event completion
  const handleToggleEventStatus = (id: string) => {
    setEvents(prev =>
      prev.map(evt =>
        evt.id === id
          ? { ...evt, status: evt.status === "completed" ? "pending" : "completed" }
          : evt
      )
    )
  }

  // Render event icon
  const getEventIcon = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "deadline":
        return <AlertCircle className="h-4 w-4 text-warning" />
      case "meeting":
        return <Video className="h-4 w-4 text-primary" />
      case "interview":
        return <UserCheck className="h-4 w-4 text-secondary" />
    }
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Calendar
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize project milestones, hackathons, and prep deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="h-8 w-8 p-0 cursor-pointer hover:bg-muted/20"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </Button>

          <span className="text-sm font-semibold text-white min-w-[100px] text-center">
            {monthYearLabel}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="h-8 w-8 p-0 cursor-pointer hover:bg-muted/20"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoToToday}
            className="text-xs cursor-pointer text-muted-foreground hover:text-white"
          >
            Today
          </Button>
        </div>
      </div>

      {/* Grid Layout: Left Filters + Center Grid + Right Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Toggles & Quick Actions (Col-span 2) */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {/* Deadlines filter toggle */}
              <button
                type="button"
                onClick={() => setFilterDeadlines(!filterDeadlines)}
                className={`flex items-center justify-between w-full text-left rounded-lg p-2 text-xs font-medium cursor-pointer transition-all border outline-none ${
                  filterDeadlines 
                    ? "border-warning/30 bg-warning/5 text-warning" 
                    : "border-border/20 bg-muted/5 text-muted-foreground hover:bg-muted/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-warning inline-block shrink-0" />
                  Deadlines
                </span>
                <span className="text-[10px] font-bold opacity-60">
                  {filterDeadlines ? "ON" : "OFF"}
                </span>
              </button>

              {/* Meetings filter toggle */}
              <button
                type="button"
                onClick={() => setFilterMeetings(!filterMeetings)}
                className={`flex items-center justify-between w-full text-left rounded-lg p-2 text-xs font-medium cursor-pointer transition-all border outline-none ${
                  filterMeetings 
                    ? "border-primary/30 bg-primary/5 text-primary" 
                    : "border-border/20 bg-muted/5 text-muted-foreground hover:bg-muted/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block shrink-0" />
                  Meetings
                </span>
                <span className="text-[10px] font-bold opacity-60">
                  {filterMeetings ? "ON" : "OFF"}
                </span>
              </button>

              {/* Interviews filter toggle */}
              <button
                type="button"
                onClick={() => setFilterInterviews(!filterInterviews)}
                className={`flex items-center justify-between w-full text-left rounded-lg p-2 text-xs font-medium cursor-pointer transition-all border outline-none ${
                  filterInterviews 
                    ? "border-secondary/30 bg-secondary/5 text-secondary" 
                    : "border-border/20 bg-muted/5 text-muted-foreground hover:bg-muted/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-secondary inline-block shrink-0" />
                  Interviews
                </span>
                <span className="text-[10px] font-bold opacity-60">
                  {filterInterviews ? "ON" : "OFF"}
                </span>
              </button>
            </CardContent>
          </Card>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full justify-center gap-2 cursor-pointer font-bold bg-primary text-black hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* Center Column: Month Grid (Col-span 7) */}
        <div className="lg:col-span-7">
          <Card className="p-4">
            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              events={filteredEvents}
            />
          </Card>
        </div>

        {/* Right Column: Daily Agenda Sidebar (Col-span 3) */}
        <div className="lg:col-span-3">
          <Card className="h-full min-h-[460px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Selected Agenda
              </CardTitle>
              <CardDescription>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric"
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {selectedDayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/40 rounded-xl bg-muted/5 min-h-[300px]">
                  <CalendarDays className="h-8 w-8 text-muted-foreground/30 mb-2 shrink-0" />
                  <span className="text-xs font-semibold text-muted-foreground">No events scheduled</span>
                  <span className="text-[10px] text-muted-foreground/60 mt-1 max-w-[150px] leading-normal">
                    Click the plus button to add tasks for this day.
                  </span>
                </div>
              ) : (
                selectedDayEvents.map(event => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => handleToggleEventStatus(event.id)}
                    className="flex flex-col items-start gap-2.5 w-full text-left rounded-xl border border-border/40 bg-muted/5 p-3 hover:bg-accent/40 transition-colors cursor-pointer group outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                        {getEventIcon(event.type)}
                        {event.time}
                      </span>
                      <span className="shrink-0">
                        {event.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/45 group-hover:text-muted-foreground transition-colors" />
                        )}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className={`text-sm font-semibold block leading-tight ${
                        event.status === "completed" 
                          ? "text-muted-foreground/60 line-through decoration-muted-foreground/40" 
                          : "text-white"
                      }`}>
                        {event.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground leading-normal block">
                        {event.description}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog Overlay */}
      <EventDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        selectedDate={selectedDate}
        onSubmit={handleAddEvent}
      />
    </div>
  )
}
