import * as React from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isUnlocked = useAuthStore((state) => state.isUnlocked)

  if (!isUnlocked) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
