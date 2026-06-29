import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "@/components/layout/AppLayout"
import ProtectedRoute from "@/components/layout/ProtectedRoute"
import LandingPage from "@/features/landing/pages/LandingPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import CalendarPage from "@/features/calendar/pages/CalendarPage"
import OpportunitiesPage from "@/features/opportunities/pages/OpportunitiesPage"
import CodingPage from "@/features/coding/pages/CodingPage"
import ProjectsPage from "@/features/projects/pages/ProjectsPage"
import ResourcesPage from "@/features/resources/pages/ResourcesPage"
import AnalyticsPage from "@/features/analytics/pages/AnalyticsPage"
import AIPage from "@/features/ai/pages/AIPage"
import ProfilePage from "@/features/profile/pages/ProfilePage"
import SettingsPage from "@/features/settings/pages/SettingsPage"
import DesignSystemPage from "@/features/design-system/pages/DesignSystemPage"
import { useAuthStore } from "@/store/useAuthStore"

function NavigateToFallback() {
  const isUnlocked = useAuthStore((state) => state.isUnlocked)
  return <Navigate to={isUnlocked ? "/dashboard" : "/"} replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Protected App Shell Wrapper */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          {/* Main primary destinations */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/coding" element={<CodingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai" element={<AIPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Route>
        
        {/* Wildcard fallback redirection */}
        <Route path="*" element={<NavigateToFallback />} />
      </Routes>
    </BrowserRouter>
  )
}
