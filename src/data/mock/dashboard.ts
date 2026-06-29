export interface UserProfile {
  name: string
  title: string
  streak: number
}

export interface TodayFocusItem {
  id: string
  text: string
  completed: boolean
}

export interface ActiveProject {
  id: string
  name: string
  category: string
  progress: number
}

export interface CodingStats {
  githubStreak: number
  leetcodeSolved: number
  openPRs: number
}

export interface UpcomingEvent {
  id: string
  title: string
  time: string
  type: "deadline" | "meeting" | "interview"
}

export interface SpotlightOpportunity {
  title: string
  deadline: string
  dsaReadiness: number
  projectsReadiness: number
}

export interface QuickLink {
  name: string
  shortcut: string
  iconName: "Github" | "Code2" | "Calendar" | "FileText" | "ExternalLink"
}

export interface CurrentMission {
  title: string
  target: string
  progress: number
  focus: string[]
}

export interface ContinueWorkItem {
  id: string
  name: string
  timeAgo: string
  iconName: "FolderCode" | "FileText" | "Shield"
}

export const MOCK_USER: UserProfile = {
  name: "Manas",
  title: "Computer Engineering Student",
  streak: 0, // 0 day coding streak
}

export const MOCK_TODAY_FOCUS: TodayFocusItem[] = [
  { id: "1", text: "Solve Graphs & Tree questions on LeetCode", completed: false },
  { id: "2", text: "Update Resume with SafeReady achievements", completed: false },
  { id: "3", text: "Push CareerOS Sprint 4 layout commits", completed: false },
  { id: "4", text: "Prepare system design case study for STEP prep", completed: false },
]

export const MOCK_PROJECTS: ActiveProject[] = [
  { id: "1", name: "SafeReady", category: "Full-Stack Security", progress: 82 },
  { id: "2", name: "CareerOS", category: "Productivity Shell", progress: 45 },
]

export const MOCK_CODING_STATS: CodingStats = {
  githubStreak: 0,
  leetcodeSolved: 31,
  openPRs: 3,
}

export const MOCK_UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: "1", title: "Flipkart GRID Proposal Deadline", time: "Today, 11:59 PM", type: "deadline" },
  { id: "2", title: "Vite Build Session & Review", time: "Tomorrow, 4:00 PM", type: "meeting" },
  { id: "3", title: "Google STEP Prep Sync", time: "July 2, 2:30 PM", type: "interview" },
]

export const MOCK_SPOTLIGHT_OPPORTUNITY: SpotlightOpportunity = {
  title: "Flipkart GRID 8.0",
  deadline: "Opens in 14 days",
  dsaReadiness: 65,
  projectsReadiness: 90,
}

export const MOCK_QUICK_LINKS: QuickLink[] = [
  { name: "GitHub Profile", shortcut: "g h", iconName: "Github" },
  { name: "LeetCode Dashboard", shortcut: "l c", iconName: "Code2" },
  { name: "Google Calendar", shortcut: "g c", iconName: "Calendar" },
  { name: "Resume Document", shortcut: "r d", iconName: "FileText" },
]

export const MOCK_CURRENT_MISSION: CurrentMission = {
  title: "Become Placement Ready",
  target: "July 2027",
  progress: 72,
  focus: ["DSA", "Open Source", "Projects"],
}

export const MOCK_CONTINUE_WORKING: ContinueWorkItem[] = [
  { id: "1", name: "CareerOS", timeAgo: "opened 3 hours ago", iconName: "FolderCode" },
  { id: "2", name: "Resume Portfolio", timeAgo: "updated yesterday", iconName: "FileText" },
  { id: "3", name: "SafeReady", timeAgo: "updated 5 days ago", iconName: "Shield" },
]
