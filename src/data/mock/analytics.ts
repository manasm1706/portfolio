export interface MonthlySolvedTrend {
  month: string
  solved: number
}

export interface ProjectActivity {
  name: string
  status: "Active" | "Moderate" | "Low"
  color: string
}

export interface PipelineStage {
  stage: string
  count: number
  color: string
}

export interface StudyHours {
  subject: string
  hours: number
  color: string
}

export interface ReflectionSummary {
  problemsSolvedThisMonth: number
  projectsUpdated: number
  applicationsSubmitted: number
  hackathonsJoined: number
  mostActiveArea: string
  leastActiveArea: string
}

export const MOCK_MONTHLY_SOLVES: MonthlySolvedTrend[] = [
  { month: "Jan", solved: 12 },
  { month: "Feb", solved: 18 },
  { month: "Mar", solved: 22 },
  { month: "Apr", solved: 25 },
  { month: "May", solved: 28 },
  { month: "Jun", solved: 31 }
]

export const MOCK_PROJECT_ACTIVITIES: ProjectActivity[] = [
  { name: "CareerOS", status: "Active", color: "#60A5FA" },
  { name: "SafeReady", status: "Moderate", color: "#A78BFA" },
  { name: "Resume Portfolio", status: "Low", color: "#71717A" }
]

export const MOCK_PIPELINE_STAGES: PipelineStage[] = [
  { stage: "Target", count: 1, color: "#60A5FA" },
  { stage: "Preparing", count: 2, color: "#FBBF24" },
  { stage: "Completed", count: 2, color: "#4ADE80" }
]

export const MOCK_STUDY_HOURS: StudyHours[] = [
  { subject: "Backend Development", hours: 12, color: "#60A5FA" },
  { subject: "React Architecture", hours: 10, color: "#A78BFA" },
  { subject: "System Design", hours: 8, color: "#FB923C" },
  { subject: "DSA Core Practice", hours: 15, color: "#4ADE80" }
]

export const MOCK_REFLECTION: ReflectionSummary = {
  problemsSolvedThisMonth: 12,
  projectsUpdated: 3,
  applicationsSubmitted: 4,
  hackathonsJoined: 1,
  mostActiveArea: "Backend Development",
  leastActiveArea: "Dynamic Programming"
}
