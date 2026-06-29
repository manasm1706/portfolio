import * as React from "react"
import { cn } from "@/utils/cn"
import type { CalendarEvent } from "@/data/mock/calendar"

export interface CalendarGridProps {
  currentDate: Date
  selectedDate: Date
  onSelectDate: (date: Date) => void
  events: CalendarEvent[]
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarGrid({ currentDate, selectedDate, onSelectDate, events }: CalendarGridProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const gridDays = React.useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const cells: { date: Date; isCurrentMonth: boolean; isToday: boolean }[] = []

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
        isToday: false
      })
    }

    // Current month days
    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const isToday = 
        date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()
      cells.push({
        date,
        isCurrentMonth: true,
        isToday
      })
    }

    // Next month filler days to complete standard 42-day layout
    const totalRemaining = 42 - cells.length
    for (let i = 1; i <= totalRemaining; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      })
    }

    return cells
  }, [year, month])

  // Get events on a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const d = new Date(event.date)
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      )
    })
  }

  return (
    <div className="space-y-3">
      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground/60 tracking-wider uppercase">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* 42-day grid */}
      <div className="grid grid-cols-7 gap-2">
        {gridDays.map((cell, idx) => {
          const dayEvents = getEventsForDay(cell.date)
          const isSelected = 
            selectedDate.getDate() === cell.date.getDate() &&
            selectedDate.getMonth() === cell.date.getMonth() &&
            selectedDate.getFullYear() === cell.date.getFullYear()

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(cell.date)}
              className={cn(
                "h-20 flex flex-col items-start justify-between p-2.5 rounded-xl border transition-all text-left outline-none cursor-pointer group focus-visible:ring-1 focus-visible:ring-primary",
                // Elevation 1 Surface
                cell.isCurrentMonth 
                  ? "bg-card/50 border-border/40 hover:bg-muted/15 hover:border-border/80" 
                  : "bg-muted/5 border-border/20 text-muted-foreground/40 hover:bg-muted/10",
                // Selected Day
                isSelected && "border-primary/80 bg-primary/5 hover:bg-primary/5 hover:border-primary",
                // Today Day
                cell.isToday && !isSelected && "border-success/30 bg-success/5 text-success"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className={cn(
                  "text-xs font-bold",
                  cell.isToday && "text-success font-black",
                  cell.isCurrentMonth && !cell.isToday && "text-white/80 group-hover:text-white"
                )}>
                  {cell.date.getDate()}
                </span>
                {cell.isToday && (
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-success">
                    Today
                  </span>
                )}
              </div>

              {/* Event Marker Dots */}
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5 w-full">
                  {dayEvents.map(event => (
                    <span
                      key={event.id}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        {
                          "bg-warning": event.type === "deadline",
                          "bg-primary": event.type === "meeting",
                          "bg-secondary": event.type === "interview"
                        }
                      )}
                      title={event.title}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
