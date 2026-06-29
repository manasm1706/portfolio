import * as React from "react"
import { 
  Sparkles, 
  Trash, 
  Plus, 
  Mail, 
  LayoutDashboard, 
  Code2, 
  AlertCircle,
  HelpCircle,
  UserCheck,
  Settings
} from "lucide-react"

import { SidebarItem } from "@/components/layout/SidebarItem"
import { 
  Button,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Badge,
  Input,
  Textarea,
  Separator,
  Progress,
  Avatar,
  Skeleton,
  PageHeader,
  SectionHeader,
  MetricCard,
  EmptyState,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui"

export default function DesignSystemPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [progressVal, setProgressVal] = React.useState(68)

  return (
    <TooltipProvider>
      <div className="space-y-12 max-w-[1200px] mx-auto pb-24">
        {/* Page Header */}
        <PageHeader 
          title="Design System & UI Primitives" 
          description="CareerOS Design Language showcase. Built in compliance with docs/DESIGN.md: 12px border radius, Geist typography, strict flat colors, minimal shadows, and subtle micro-interactions."
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Doc Reference</Button>
              <Button variant="primary" size="sm" onClick={() => setProgressVal(prev => prev >= 100 ? 0 : prev + 10)}>
                Animate Progress
              </Button>
            </div>
          }
        />

        {/* Section 1: Primitive UI Components */}
        <section className="space-y-6">
          <SectionHeader 
            title="1. Primitive UI Components" 
            description="Fundamental styling building blocks of the CareerOS interface."
          />

          <div className="grid gap-8">
            {/* Buttons & Badges Group */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons & Badges</CardTitle>
                <CardDescription>Visual actions and status tags featuring correct hover, disabled, and focus states.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Buttons Grid */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Button Variants & Sizes</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button variant="primary">Primary Accent</Button>
                    <Button variant="secondary">Secondary (Default)</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="primary" disabled>Disabled State</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                  </div>
                </div>

                <Separator />

                {/* Badges Grid */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Badge System</span>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Primary Badge</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info / Muted</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Textarea Group */}
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Input fields supporting error highlighting, outline focus, and standard placeholder states.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white">Default Field</label>
                    <Input placeholder="Enter your project name..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-danger">Field with Error</label>
                    <Input placeholder="Invalid input value" error />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Disabled Input</label>
                    <Input placeholder="Disabled state" disabled />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white">Textarea</label>
                    <Textarea placeholder="Type description or notes here..." rows={4} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-danger">Textarea with Error</label>
                    <Textarea placeholder="Field invalid description" error rows={2} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avatars, Progress & Skeletons */}
            <Card>
              <CardHeader>
                <CardTitle>Avatars, Progress & Skeletons</CardTitle>
                <CardDescription>Visual content representations, metrics completion, and loading skeletons.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-8 md:grid-cols-3">
                {/* Avatars */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 block">Avatars</span>
                  <div className="flex items-center gap-4">
                    <Avatar fallback="AD" size="lg" />
                    <Avatar fallback="OS" size="md" shape="square" />
                    <Avatar fallback="JD" size="sm" />
                    <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar demo" size="md" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Accepts images, fallbacks, circular and 12px square geometries.
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 block">Progress ({progressVal}%)</span>
                  <div className="space-y-3 pt-2">
                    <Progress value={progressVal} />
                    <Progress value={35} className="h-1 bg-muted/65" />
                    <Progress value={100} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Smooth width transitions using token system colors.
                  </div>
                </div>

                {/* Loading Skeletons */}
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 block">Skeletons</span>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3 w-[70%]" />
                        <Skeleton className="h-2 w-[40%]" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pulsing block shapes that adapt to layouts.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Layout Variants */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Card Geometry & Hierarchy</span>
              <div className="grid gap-6 md:grid-cols-3">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="text-sm">Default Card</CardTitle>
                    <CardDescription>Flat bg, standard borders.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Used for base grid items and inline containers. Fits inside page layouts seamlessly.
                  </CardContent>
                </Card>
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-sm">Elevated Card</CardTitle>
                    <CardDescription>Darker bg, slight shadow.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Used for popups, modals, sidebar modules, or items that need slight depth separation.
                  </CardContent>
                </Card>
                <Card variant="interactive">
                  <CardHeader>
                    <CardTitle className="text-sm">Interactive Card</CardTitle>
                    <CardDescription>Hover lift, highlight borders.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Used for clickable items, dashboards widgets, and navigate list actions. Focus ring outlines.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Radix-Backed Interactive Components */}
        <section className="space-y-6">
          <SectionHeader 
            title="2. Interactive Radix Components" 
            description="Components that involve active popups, keyboard trapping, overlays, and hover tooltips."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {/* Tooltip Demonstration */}
            <Card>
              <CardHeader>
                <CardTitle>Tooltip</CardTitle>
                <CardDescription>Contextual metadata shown on hover/focus.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 min-h-[120px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center gap-1.5 rounded-lg border border-border bg-popover px-4 py-2 text-sm text-white hover:bg-accent transition-colors cursor-help">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      Hover Me
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">GitHub Activity</p>
                    <p className="text-[10px] mt-0.5 text-muted-foreground">This reflects your contribution streak in the last 7 days.</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Dropdown Menu Demonstration */}
            <Card>
              <CardHeader>
                <CardTitle>Dropdown Menu</CardTitle>
                <CardDescription>List-based overlays triggered by actions.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 min-h-[120px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary">Actions Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Optimize Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard View</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>
                    <DropdownMenuItem className="text-danger focus:bg-danger/10 focus:text-danger">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete Cache</span>
                      <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            {/* Dialog Demonstration */}
            <Card>
              <CardHeader>
                <CardTitle>Dialog / Modal</CardTitle>
                <CardDescription>Overlay modal box with escape support.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 min-h-[120px]">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="primary">Launch Modal</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Operation</DialogTitle>
                      <DialogDescription>
                        This will verify your profile sync with GitHub. This action is safe and does not alter repositories.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/40 my-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success border border-success/20">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Ambitious Dev</p>
                        <p className="text-[10px] text-muted-foreground">Connected with manas-mungekar</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="ghost" size="sm">Cancel</Button>
                      </DialogClose>
                      <Button variant="primary" size="sm" onClick={() => { setIsDialogOpen(false); alert("GitHub Sync Initiated!"); }}>
                        Confirm Sync
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: Composite UI Components */}
        <section className="space-y-6">
          <SectionHeader 
            title="3. Composite UI Components" 
            description="Combined layout segments designed for data visualization, empty list tracking, and headers."
          />

          <div className="grid gap-8">
            {/* Metric Cards Grid */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Metric Cards (Showcases key analytics trends)</span>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <MetricCard 
                  title="LeetCode Solved" 
                  value="142" 
                  description="8 easy, 4 medium, 0 hard this week" 
                  icon={Code2} 
                  trend={{ value: "+12%", isPositive: true }}
                />
                <MetricCard 
                  title="GitHub Commits" 
                  value="427" 
                  progress={75}
                  description="Goal: 500 commits in Sprint 2" 
                  icon={LayoutDashboard}
                  trend={{ value: "+24%", isPositive: true }}
                />
                <MetricCard 
                  title="Applications Sent" 
                  value="19" 
                  description="3 interviews pending" 
                  icon={Mail} 
                  trend={{ value: "-4%", isPositive: false }}
                />
                <MetricCard 
                  title="AI Study Hours" 
                  value="36.5 hrs" 
                  description="Daily average: 5.2 hrs" 
                  icon={Sparkles} 
                  variant="elevated"
                />
              </div>
            </div>

            {/* Sidebar Item & Headers Showcase */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Sidebar Menu Item Samples */}
              <Card>
                <CardHeader>
                  <CardTitle>Sidebar Navigation Primitives</CardTitle>
                  <CardDescription>Shows link states inside the layout navigation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-w-[280px]">
                  <SidebarItem 
                    to="/design-system" 
                    icon={LayoutDashboard} 
                    label="Dashboard Page" 
                    isActive={true} 
                    badge="5"
                  />
                  <SidebarItem 
                    to="/design-system" 
                    icon={Code2} 
                    label="Coding Progress" 
                    isActive={false} 
                  />
                  <SidebarItem 
                    to="/design-system" 
                    icon={Settings} 
                    label="User Settings" 
                    isActive={false} 
                    badge="!"
                  />
                </CardContent>
              </Card>

              {/* Section Header Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Section Header Sample</CardTitle>
                  <CardDescription>Standalone inline division segment layout.</CardDescription>
                </CardHeader>
                <CardContent className="bg-muted/15 p-4 rounded-xl border border-border/40">
                  <SectionHeader 
                    title="Opportunities List" 
                    description="Filtered by Application Status (Active)" 
                    actions={<Button variant="primary" size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New Tracker</Button>}
                  />
                  <div className="h-10 bg-card rounded-lg border border-border flex items-center px-3 text-xs text-muted-foreground">
                    Mock Table Content...
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Empty State Showcase */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Empty State Layout</span>
              <EmptyState 
                title="No active project opportunities tracker" 
                description="You haven't added any internships or hackathons trackers to your career funnel yet. Keep track of application timelines easily."
                icon={AlertCircle}
                action={
                  <Button variant="primary" size="sm">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Opportunity
                  </Button>
                }
              />
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}
