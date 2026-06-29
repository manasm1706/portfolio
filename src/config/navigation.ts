import { 
  LayoutDashboard, 
  Calendar, 
  Briefcase, 
  Code2, 
  FolderCode, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  User, 
  Settings 
} from "lucide-react"

export interface NavigationItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  group?: string
  searchable?: boolean
  shortcut?: string
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    group: "Navigation",
    searchable: true,
    shortcut: "g d",
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: Calendar,
    group: "Navigation",
    searchable: true,
    shortcut: "g c",
  },
  {
    name: "Opportunities",
    path: "/opportunities",
    icon: Briefcase,
    group: "Navigation",
    searchable: true,
    shortcut: "g o",
  },
  {
    name: "Coding",
    path: "/coding",
    icon: Code2,
    group: "Navigation",
    searchable: true,
    shortcut: "g k",
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderCode,
    group: "Navigation",
    searchable: true,
    shortcut: "g p",
  },
  {
    name: "Resources",
    path: "/resources",
    icon: BookOpen,
    group: "Navigation",
    searchable: true,
    shortcut: "g r",
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    group: "Navigation",
    searchable: true,
    shortcut: "g a",
  },
  {
    name: "AI Coach",
    path: "/ai",
    icon: Sparkles,
    group: "Navigation",
    searchable: true,
    shortcut: "g i",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
    group: "Navigation",
    searchable: true,
    shortcut: "g u",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    group: "Navigation",
    searchable: true,
    shortcut: "g s",
  },
]
