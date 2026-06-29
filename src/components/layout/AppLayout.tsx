import * as React from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, ChevronLeft, ChevronRight, Bell } from "lucide-react"
import { NAVIGATION_ITEMS } from "@/config/navigation"
import { cn } from "@/utils/cn"
import { SidebarItem } from "@/components/layout/SidebarItem"
import { SidebarSectionHeader } from "@/components/layout/SidebarSectionHeader"
import { TopNavSearch } from "@/components/layout/TopNavSearch"
import { useSidebarStore } from "@/store/useSidebarStore"
import { useCommandPaletteStore } from "@/store/useCommandPaletteStore"
import { CommandPalette } from "@/components/layout/CommandPalette"
import { 
  Button,
  Avatar, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider, 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from "@/components/ui"

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  const { isCollapsed, toggleSidebar } = useSidebarStore()
  const { setOpen: setCommandPaletteOpen } = useCommandPaletteStore()

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground font-sans">
        {/* Sidebar - Desktop */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-20 hidden border-r border-border bg-card flex-col md:flex transition-all duration-250 ease-in-out",
            isCollapsed ? "w-[72px]" : "w-[280px]"
          )}
        >
          {/* Header/Logo */}
          <div 
            className={cn(
              "flex h-16 items-center border-b border-border transition-all duration-250 ease-in-out", 
              isCollapsed ? "px-4 justify-center" : "px-6 justify-between"
            )}
          >
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-semibold text-sm shrink-0">
                OS
              </div>
              {!isCollapsed && (
                <span className="font-semibold tracking-tight text-white text-base">CareerOS</span>
              )}
            </Link>
            {!isCollapsed && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar} 
                className="h-7 w-7 p-0 hidden md:flex shrink-0 cursor-pointer"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground hover:text-white" />
              </Button>
            )}
          </div>

          {/* Sidebar Nav */}
          <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
            <SidebarSectionHeader label={isCollapsed ? "Sys" : "System"} className={cn(isCollapsed && "text-center")} />
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              const sidebarItem = (
                <SidebarItem
                  to={item.path}
                  icon={item.icon}
                  label={item.name}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                />
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={item.path} delayDuration={50}>
                    <TooltipTrigger asChild>
                      <div className="my-1">{sidebarItem}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={16}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.path} className="my-1">{sidebarItem}</div>
            })}
          </nav>

          {/* Footer info / Profile Indicator */}
          <div className="border-t border-border p-4 flex flex-col items-center">
            {isCollapsed && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar} 
                className="h-7 w-7 p-0 mb-4 hidden md:flex shrink-0 cursor-pointer"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-white" />
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-150 cursor-pointer outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary w-full text-left",
                    isCollapsed ? "h-10 w-10 p-0 justify-center" : "gap-3 p-2"
                  )}
                >
                  <Avatar fallback="MM" size="sm" className="shrink-0" />
                  {!isCollapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm font-medium text-white">Manas Mungekar</span>
                      <span className="truncate text-[10px] text-muted-foreground font-semibold">Computer Engineering</span>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" side="right" align="end" sideOffset={12}>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Mobile Drawer Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 md:hidden transition-opacity duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Mobile Slider */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col md:hidden transition-transform duration-200 ease-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header/Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-black font-semibold text-sm">
                OS
              </div>
              <span className="font-semibold tracking-tight text-white text-base">CareerOS</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)} className="h-8 w-8 p-0">
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Mobile Nav */}
          <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
            <SidebarSectionHeader label="System" />
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <SidebarItem
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  icon={item.icon}
                  label={item.name}
                  isActive={isActive}
                />
              )
            })}
          </nav>

          {/* Footer info / Profile Mobile */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 p-2">
              <Avatar fallback="MM" size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-medium text-white">Manas Mungekar</span>
                <span className="truncate text-xs text-muted-foreground font-semibold">Computer Engineering</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div 
          className={cn(
            "flex flex-1 flex-col transition-all duration-250 ease-in-out",
            isCollapsed ? "md:pl-[72px]" : "md:pl-[280px]"
          )}
        >
          {/* Top Navbar */}
          <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-8">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Open Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="h-9 w-9 p-0 md:hidden"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </Button>

              {/* Breadcrumbs or Page Title Indicator (Desktop) */}
              <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground md:flex">
                <span className="hover:text-foreground transition-colors cursor-pointer" onClick={() => navigate("/")}>CareerOS</span>
                <span>/</span>
                <span className="text-white font-medium capitalize">
                  {location.pathname === "/" || location.pathname === "" 
                    ? "Dashboard" 
                    : location.pathname.substring(1).replace("-", " ")}
                </span>
              </div>
            </div>

            {/* Search and Placeholder Icons */}
            <div className="flex items-center gap-3 flex-1 justify-end max-w-md ml-auto">
              <TopNavSearch onClick={() => setCommandPaletteOpen(true)} />

              {/* Quick stats active indicator */}
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-border bg-popover px-2.5 py-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
                <span>OS Active</span>
              </div>

              {/* Notification Placeholder bell icon */}
              <button 
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-popover text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => alert("Notifications: Feature out of scope for Sprint 3")}
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Content Container */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette />
    </TooltipProvider>
  )
}
