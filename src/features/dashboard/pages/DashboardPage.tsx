import { 
  MOCK_USER, 
  MOCK_TODAY_FOCUS, 
  MOCK_PROJECTS, 
  MOCK_CODING_STATS, 
  MOCK_UPCOMING_EVENTS, 
  MOCK_SPOTLIGHT_OPPORTUNITY, 
  MOCK_QUICK_LINKS,
  MOCK_CURRENT_MISSION,
  MOCK_CONTINUE_WORKING
} from "@/data/mock/dashboard"

import { Card } from "@/components/ui"
import { HeroSection } from "../components/HeroSection"
import { CurrentMissionWidget } from "../components/CurrentMissionWidget"
import { TodayFocusWidget } from "../components/TodayFocusWidget"
import { ProjectProgressWidget } from "../components/ProjectProgressWidget"
import { CodingProgressWidget } from "../components/CodingProgressWidget"
import { UpcomingEventsWidget } from "../components/UpcomingEventsWidget"
import { ContinueWorkingWidget } from "../components/ContinueWorkingWidget"
import { OpportunitySpotlightWidget } from "../components/OpportunitySpotlightWidget"
import { QuickLinksWidget } from "../components/QuickLinksWidget"

export default function DashboardPage() {
  // Focus count (tasks incomplete)
  const focusCount = MOCK_TODAY_FOCUS.filter(t => !t.completed).length
  // Upcoming deadlines count (deadline events)
  const upcomingCount = MOCK_UPCOMING_EVENTS.filter(e => e.type === "deadline").length

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-12">
      {/* Row 1: Hero Section (Left 65%) + Current Mission (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1fr] gap-6 items-stretch">
        <Card variant="elevated" className="p-6 md:p-8 flex flex-col justify-center h-full">
          <HeroSection 
            user={MOCK_USER} 
            focusCount={focusCount} 
            upcomingCount={upcomingCount}
          />
        </Card>
        <div>
          <CurrentMissionWidget mission={MOCK_CURRENT_MISSION} variant="elevated" />
        </div>
      </div>

      {/* Row 2: Today's Focus (Left full-height) + Projects/Coding stack (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <TodayFocusWidget initialTasks={MOCK_TODAY_FOCUS} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <ProjectProgressWidget projects={MOCK_PROJECTS} />
          </div>
          <div className="flex-1">
            <CodingProgressWidget stats={MOCK_CODING_STATS} />
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming/Continue Working stack (Left) + Opportunity Spotlight (Right full-height) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <UpcomingEventsWidget events={MOCK_UPCOMING_EVENTS} />
          </div>
          <div className="flex-1">
            <ContinueWorkingWidget items={MOCK_CONTINUE_WORKING} />
          </div>
        </div>
        <div className="h-full">
          <OpportunitySpotlightWidget opportunity={MOCK_SPOTLIGHT_OPPORTUNITY} />
        </div>
      </div>

      {/* Row 4: Quick Links (Full width command bar) */}
      <div className="w-full">
        <QuickLinksWidget links={MOCK_QUICK_LINKS} />
      </div>
    </div>
  )
}
