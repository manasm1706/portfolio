export interface CalendarEvent {
  id: string
  title: string
  description: string
  date: Date
  time: string
  type: "deadline" | "meeting" | "interview"
  status: "pending" | "completed" | "missed"
}

const getRelativeDate = (offsetDays: number, hour = 12, minute = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  d.setHours(hour, minute, 0, 0)
  return d
}

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Flipkart GRID Proposal",
    description: "Submit the round 1 team proposal details for the Flipkart GRID 8.0 hackathon.",
    date: getRelativeDate(0),
    time: "11:59 PM",
    type: "deadline",
    status: "pending"
  },
  {
    id: "2",
    title: "Vite Build Session",
    description: "Synchronize layout systems and review bundling with the team.",
    date: getRelativeDate(1),
    time: "4:00 PM",
    type: "meeting",
    status: "pending"
  },
  {
    id: "3",
    title: "Google STEP Prep Sync",
    description: "Mock technical coding interview prep covering trees, graphs, and system design basics.",
    date: getRelativeDate(6),
    time: "2:30 PM",
    type: "interview",
    status: "pending"
  },
  {
    id: "4",
    title: "LabourNet Beta Release",
    description: "Deploy the contractor application workflow to staging for feedback.",
    date: getRelativeDate(12),
    time: "9:00 AM",
    type: "deadline",
    status: "pending"
  },
  {
    id: "5",
    title: "Eagle Electrical Intern debrief",
    description: "Review Reprice AI deployment metrics and final machine learning model updates with manager.",
    date: getRelativeDate(16),
    time: "11:00 AM",
    type: "meeting",
    status: "pending"
  },
  {
    id: "6",
    title: "Megasys Sync Interview",
    description: "Technical screen for extension of full stack Web/App development projects.",
    date: getRelativeDate(19),
    time: "3:00 PM",
    type: "interview",
    status: "pending"
  },
  {
    id: "7",
    title: "Disaster Relief Smart Contract",
    description: "Audit Solidity fund collection contract features for gas optimizations.",
    date: getRelativeDate(24),
    time: "6:00 PM",
    type: "deadline",
    status: "pending"
  }
]
