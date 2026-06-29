import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CalendarEvent } from "@/data/mock/calendar"

export interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  onSubmit: (eventData: Omit<CalendarEvent, "id">) => void
}

export function EventDialog({ open, onOpenChange, selectedDate, onSubmit }: EventDialogProps) {
  const [title, setTitle] = React.useState("")
  const [type, setType] = React.useState<CalendarEvent["type"]>("meeting")
  const [time, setTime] = React.useState("12:00 PM")
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setTitle("")
      setType("meeting")
      setTime("12:00 PM")
      setDescription("")
    }
  }, [open])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title,
      type,
      time,
      description,
      date: selectedDate,
      status: "pending"
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Calendar Event</DialogTitle>
          <DialogDescription>
            Schedule a session for {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="event-title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Event Title
            </label>
            <Input
              id="event-title"
              placeholder="e.g. Google STEP Prep Sync"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Event Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["meeting", "deadline", "interview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium capitalize text-center cursor-pointer transition-all outline-none ${
                    type === t
                      ? "border-primary/80 bg-primary/10 text-white font-bold"
                      : "border-border/40 bg-muted/10 text-muted-foreground hover:bg-muted/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="space-y-1.5">
            <label htmlFor="event-time" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Time
            </label>
            <Input
              id="event-time"
              placeholder="e.g. 2:30 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="event-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <Textarea
              id="event-desc"
              placeholder="Provide a quick summary or checklist items..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer font-bold bg-primary text-black hover:bg-primary/90">
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
