import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronRight, 
  ExternalLink, 
  Lock, 
  Unlock,
  User as UserIcon, 
  Cpu, 
  CheckCircle,
  Database,
  Calendar,
  AlertCircle,
  Layers,
  Shield,
  Code as CodeIcon
} from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { Button, Input, Textarea, Card, Badge } from "@/components/ui"
import FishSimulation from "../components/FishSimulation"
import { MOCK_CURRENT_MISSION, MOCK_UPCOMING_EVENTS } from "@/data/mock/dashboard"
import type { UpcomingEvent } from "@/data/mock/dashboard"

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export default function LandingPage() {
  const navigate = useNavigate()
  const { isUnlocked, unlock } = useAuthStore()

  // Clocks State
  const [timeLocal, setTimeLocal] = React.useState("")
  const [timeUTC, setTimeUTC] = React.useState("")

  // Word Rotator State
  const WORDS = ["ENGINEER", "BUILDER", "DEVELOPER", "PROBLEM-SOLVER"]
  const [wordIndex, setWordIndex] = React.useState(0)

  // Interactive Terminal State
  const [terminalLogs, setTerminalLogs] = React.useState<string[]>([
    "// Type or click one of the quick command buttons below...",
    "// Welcome to manas.sh kernel v1.0.0"
  ])

  // Form states
  const [unlockCode, setUnlockCode] = React.useState("")
  const [contactName, setContactName] = React.useState("")
  const [contactEmail, setContactEmail] = React.useState("")
  const [contactMessage, setContactMessage] = React.useState("")
  
  // Feedbacks
  const [isContactSubmitted, setIsContactSubmitted] = React.useState(false)
  const [unlockError, setUnlockError] = React.useState("")
  const [isUnlocking, setIsUnlocking] = React.useState(false)
  const [unlockLogs, setUnlockLogs] = React.useState<string[]>([])

  // Setup Clocks
  React.useEffect(() => {
    const updateClocks = () => {
      const d = new Date()
      setTimeLocal(
        d.toLocaleTimeString("en-US", { 
          hour12: false, 
          hour: "2-digit", 
          minute: "2-digit", 
          second: "2-digit" 
        })
      )
      setTimeUTC(d.toISOString().substring(11, 19) + " UTC")
    }
    updateClocks()
    const timer = setInterval(updateClocks, 1000)
    return () => clearInterval(timer)
  }, [])

  // Setup Word Rotator
  React.useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle Terminal CLI clicks
  const runTerminalCommand = (cmd: "story" | "projects" | "contact" | "clear") => {
    if (cmd === "clear") {
      setTerminalLogs([])
      return
    }

    let newLogs: string[] = []
    if (cmd === "story") {
      newLogs = [
        `$ run manas_story.sh`,
        `Analyzing education nodes...`,
        `  Name: Manas Mungekar`,
        `  Focus: Computer Engineering Student`,
        `  Fields: Full-Stack Web Development, Vector DB indexing, Blockchain protocols`,
        `  Mindset: Crafting high-fidelity developer tooling structures.`,
        `// Status: Ready.`
      ]
    } else if (cmd === "projects") {
      newLogs = [
        `$ list-projects --active`,
        `Scanning active workspaces...`,
        `  1. CareerOS      | Progress: 68% | Stack: React, TS, Zustand`,
        `  2. SafeReady     | Progress: 82% | Stack: Vector DB, Pinecone`,
        `  3. Reprice AI    | Progress: 100% | Stack: ML Pricing engine`,
        `  4. PharmaWare    | Progress: 100% | Winner Invictus Hackathon`,
        `// Use the projects section below to explore detailed cards.`
      ]
    } else if (cmd === "contact") {
      newLogs = [
        `$ cat contact_routes.conf`,
        `  Local Clock: ${timeLocal} PM`,
        `  UTC Connection: Secure SSL`,
        `  Email Pointer: manasmungekar@career-os.dev`,
        `  Unlock Key: CodePirate (case-insensitive)`,
        `// Run the unlock sequence in the security card below to grant layout access.`
      ]
    }

    setTerminalLogs((prev) => [...prev, ...newLogs])
  }

  // Handle mock contact message
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName || !contactEmail || !contactMessage) return
    setIsContactSubmitted(true)
    setTimeout(() => {
      setContactName("")
      setContactEmail("")
      setContactMessage("")
    }, 2000)
  }

  // Handle CodePirate authentication
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setUnlockError("")
    if (!unlockCode.trim()) return

    setIsUnlocking(true)
    setUnlockLogs(["[init] Requesting authorization signature..."])

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    
    await sleep(400)
    setUnlockLogs((prev) => [...prev, "[auth] Performing cryptographic comparison..."])
    
    await sleep(400)
    const success = await unlock(unlockCode)

    if (success) {
      setUnlockLogs((prev) => [
        ...prev,
        "[auth] Match verified successfully.",
        "[sys] Decrypting dashboard kernel databases...",
        "[sys] Access Granted. Launching secure session shell..."
      ])
      await sleep(650)
      navigate("/dashboard")
    } else {
      setUnlockLogs((prev) => [...prev, "[error] Access Denied: Invalid Security Signature."])
      setUnlockError("Access Denied. Signature mismatch.")
      setIsUnlocking(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0b09] text-cream font-jakarta relative overflow-x-hidden selection:bg-accent-red/20 selection:text-white">
      {/* 1. Background Fish Swarm Canvas Simulator - constrained to start section */}
      <div className="absolute top-0 left-0 right-0 h-[700px] z-0 overflow-hidden pointer-events-auto">
        <FishSimulation />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0b09]/10 via-[#0c0b09]/60 to-[#0c0b09]" />
      </div>

      {/* Header bar */}
      <header className="sticky top-0 z-50 w-full border-b border-void-panel-border bg-[#0c0b09]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Initials logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer font-space text-sm select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-cream text-void font-bold text-xs">
              MM
            </div>
            <span className="font-semibold tracking-wider text-cream">// MANAS.OS</span>
          </div>

          {/* Timezone clocks */}
          <div className="hidden md:flex items-center gap-6 font-space text-[10px] text-text-muted-dark tracking-widest select-none uppercase">
            <span>// LOCAL: {timeLocal || "00:00:00"}</span>
            <span>// ZULU: {timeUTC || "00:00:00"}</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 font-space text-xs tracking-wider uppercase">
            <button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors cursor-pointer text-text-muted-dark hover:text-cream">// ABOUT</button>
            <button onClick={() => scrollToSection("projects")} className="hover:text-white transition-colors cursor-pointer text-text-muted-dark hover:text-cream">// PROJECTS</button>
            <button onClick={() => scrollToSection("goals")} className="hover:text-white transition-colors cursor-pointer text-text-muted-dark hover:text-cream">// GOALS</button>
            
            {isUnlocked ? (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="gap-1.5 shrink-0 bg-cream hover:bg-cream-dim text-void rounded-[2px] h-8 px-3 font-space text-xs tracking-wider cursor-pointer"
              >
                <Unlock className="h-3 w-3" />
                <span>ENTER</span>
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => scrollToSection("unlock-card")}
                className="gap-1.5 shrink-0 border-void-panel-border hover:border-cream/50 bg-[#1b1916] text-cream rounded-[2px] h-8 px-3 font-space text-xs tracking-wider cursor-pointer"
              >
                <Lock className="h-3 w-3 text-accent-red" />
                <span>UNLOCK</span>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28 flex flex-col items-start relative z-10 min-h-[85vh] justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
          
          <div className="lg:col-span-8 space-y-4 flex flex-col justify-center">
            {/* Headline section */}
            <h1 className="font-anton text-7xl sm:text-9xl tracking-tight leading-[0.85] text-cream flex flex-col">
              <span>MANAS</span>
              <span>MUNGEKAR</span>
            </h1>

            {/* Kinetic rotator word */}
            <div className="relative overflow-hidden h-[70px] sm:h-[100px] flex items-center justify-start">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="text-accent-red font-anton text-5xl sm:text-8xl tracking-tight leading-[0.9]"
                >
                  {WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end text-left lg:text-right space-y-8 lg:space-y-0 py-4">
            {/* Stat Callout */}
            <div className="space-y-1">
              <span className="font-space text-[10px] text-text-muted-dark tracking-widest block select-none">// SYSTEM METRIC</span>
              <span className="font-anton text-5xl md:text-6xl text-cream block leading-[1.0]">31 SOLVED</span>
              <span className="font-space text-[9px] text-text-muted-dark uppercase tracking-widest block">// ACTIVE LEETCODE INDEX</span>
            </div>

            {/* Short Bio Block */}
            <div className="max-w-xs space-y-2">
              <span className="font-space text-[10px] text-text-muted-dark tracking-widest block select-none">// WHO I AM</span>
              <p className="font-sans text-xs text-cream/70 leading-relaxed font-jakarta">
                Computer Engineering student interested in clean abstractions, vector similarity engines, and high-performance developer workspace structures.
              </p>
            </div>

            {/* Scroll indicator */}
            <div className="flex items-center gap-2 cursor-pointer select-none font-space text-[10px] text-text-muted-dark hover:text-cream tracking-widest pt-4" onClick={() => scrollToSection("about")}>
              <span>SCROLL — [TRUST]</span>
              <ChevronRight className="h-3 w-3 text-accent-red animate-pulse" />
            </div>
          </div>

        </div>
      </section>

      {/* About Section & Notebook Widget */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-32 border-t border-void-panel-border relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="font-space text-xs text-text-muted-dark tracking-widest block">// PROFILE STRUCTURE</span>
            <h2 className="text-3xl font-anton tracking-tight text-cream uppercase leading-[0.9] text-4xl">
              Systems Mindset & High-Performance Design
            </h2>
            <p className="font-jakarta text-xs text-cream/65 leading-relaxed">
              I view development as an art of layout composition and clean pipelines. By keeping dependencies light and structures modular, the application performs predictably and scales effortlessly.
            </p>
            
            <div className="space-y-4 pt-4 border-t border-void-panel-border">
              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center bg-void-panel-border text-cream-dim text-[10px] rounded-[2px] font-space font-bold">01</div>
                <div>
                  <h4 className="text-xs font-semibold text-cream font-space tracking-wide uppercase">// ARCHITECTURE</h4>
                  <p className="text-[11px] text-cream/50 mt-1 font-jakarta">Preferring micro-stores and local scopes over generic massive state stores to optimize memory allocation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center bg-void-panel-border text-cream-dim text-[10px] rounded-[2px] font-space font-bold">02</div>
                <div>
                  <h4 className="text-xs font-semibold text-cream font-space tracking-wide uppercase">// ALGORITHMS</h4>
                  <p className="text-[11px] text-cream/50 mt-1 font-jakarta">Focusing study on spatial structures, similarity search mappings, and graph tree traversals.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grayscale photo + Notebook side-panel */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch w-full">
            
            {/* Grayscale Photo slot */}
            <div className="border border-void-panel-border bg-void-panel rounded-[2px] overflow-hidden flex flex-col justify-between p-6 relative select-none">
              <span className="font-space text-[10px] text-text-muted-dark block tracking-widest">// PHOTO PENDING</span>
              
              <div className="my-8 flex justify-center items-center">
                <div className="h-28 w-28 rounded-[2px] border border-void-panel-border flex items-center justify-center bg-[#0c0b09]">
                  <UserIcon className="h-10 w-10 text-text-muted-dark filter grayscale" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-space text-xs text-cream block">// MANAS MUNGEKAR</span>
                <span className="font-space text-[9px] text-text-muted-dark block tracking-wider uppercase">// COMPUTER ENGINEERING // CO-2027</span>
              </div>
              {/* TODO: Bind user professional portrait when available */}
            </div>

            {/* Notebook Lined Panel */}
            <div 
              className="border border-void-panel-border bg-void-panel p-6 rounded-[2px] min-h-[280px] flex flex-col justify-between relative"
              style={{
                backgroundImage: "repeating-linear-gradient(var(--void-panel), var(--void-panel) 27px, rgba(233, 221, 185, 0.04) 27px, rgba(233, 221, 185, 0.04) 28px)",
                backgroundAttachment: "local"
              }}
            >
              {/* left notebook margins */}
              <div className="absolute left-6 top-0 bottom-0 w-[1.5px] bg-accent-red/20 pointer-events-none" />
              
              <div className="pl-6 space-y-4">
                <span className="font-space text-[9px] text-text-muted-dark tracking-widest block select-none">// CORE MAXIM</span>
                <p className="font-sans text-xs italic text-cream-dim leading-relaxed font-jakarta">
                  "Simplicity is the ultimate engineering sophistication. Remove every decorative line that does not serve to clarify or organize structural information."
                </p>
              </div>

              <div className="pl-6 font-space text-[9px] text-text-muted-dark select-none">
                // CHECKPOINT LOG ID: MANAS_OS_V1.0
              </div>
              {/* TODO: Replace with rotating core maxims and design philosophies */}
            </div>

          </div>

        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-32 border-t border-void-panel-border relative z-10">
        <div className="space-y-4 mb-12">
          <span className="font-space text-xs text-text-muted-dark tracking-widest block">// WORK WORKSPACE</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-anton tracking-tight text-cream uppercase leading-[0.9] text-4xl">Featured Modules</h2>
              <p className="font-jakarta text-xs text-cream/60 mt-1.5 max-w-xl">
                Asymmetric project cards displaying structural scope and active modules.
              </p>
            </div>
            
            <a 
              href="https://github.com/manasm1706" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1.5 font-space text-xs text-cream hover:text-white hover:underline cursor-pointer"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>// VIEW ON GITHUB</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Asymmetric grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. Large Feature Card (CareerOS) */}
          <div className="lg:col-span-8 border border-void-panel-border bg-void-panel p-6 rounded-[2px] flex flex-col justify-between group hover:border-cream/20 transition-colors">
            {/* TODO: Replace placeholders with live project metadata when dynamic dashboard config is completed */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="font-space text-[10px] text-accent-red tracking-widest">// PRIMARY FEATURED MODULE</span>
                <span className="font-space text-[9px] text-text-muted-dark">// COMPILATION: SPRINT 4 ACTIVE</span>
              </div>

              <h3 className="font-anton text-3xl text-cream uppercase leading-[1.0] group-hover:text-cream-dim transition-colors">
                CareerOS
              </h3>
              
              <p className="font-jakarta text-xs text-cream/70 leading-relaxed max-w-xl">
                A premium, unified personal developer operating system aggregating calendars, opportunities, repository stats, and project builds into one calm, fast, visual workspace.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between font-space text-[9px] text-text-muted-dark">
                  <span>INDEX COMPLETE STATE</span>
                  <span>68%</span>
                </div>
                <div className="h-[2px] w-full bg-[#0c0b09] rounded-full overflow-hidden">
                  <div className="h-full bg-cream transition-all duration-300" style={{ width: "68%" }} />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["REACT", "TYPESCRIPT", "TAILWIND V4", "ZUSTAND"].map(t => (
                  <Badge key={t} className="bg-void-panel-border text-cream-dim text-[10px] tracking-wider rounded-[2px] font-space border-none">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Side smaller cards (Vertical stack) */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between items-stretch">
            
            {/* SafeReady */}
            <div className="border border-void-panel-border bg-void-panel p-5 rounded-[2px] flex flex-col justify-between flex-1 group hover:border-cream/20 transition-colors">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-space text-[9px] text-text-muted-dark tracking-widest">// SHIELD INDEX</span>
                  <span className="font-space text-[9px] text-text-muted-dark">82%</span>
                </div>
                <h4 className="font-anton text-xl text-cream uppercase group-hover:text-cream-dim transition-colors">
                  SafeReady
                </h4>
                <p className="font-jakarta text-[11px] text-cream/60 leading-relaxed">
                  Full-stack security management platform utilizing vector DB search algorithms and Pinecone.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4">
                {["NODE.js", "PINECONE"].map(t => (
                  <span key={t} className="text-[9px] font-space bg-void-panel-border text-text-muted-cream px-1.5 py-0.5 rounded-[1px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Reprice AI */}
            <div className="border border-void-panel-border bg-void-panel p-5 rounded-[2px] flex flex-col justify-between flex-1 group hover:border-cream/20 transition-colors">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-space text-[9px] text-text-muted-dark tracking-widest">// ALGO INDEX</span>
                  <span className="font-space text-[9px] text-text-muted-dark">100%</span>
                </div>
                <h4 className="font-anton text-xl text-cream uppercase group-hover:text-cream-dim transition-colors">
                  Reprice AI
                </h4>
                <p className="font-jakarta text-[11px] text-cream/60 leading-relaxed">
                  Intelligent pricing engine utilizing real-time data analysis & vector embeddings.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4">
                {["NEONDB", "VECTOR"].map(t => (
                  <span key={t} className="text-[9px] font-space bg-void-panel-border text-text-muted-cream px-1.5 py-0.5 rounded-[1px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Skills Row */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-void-panel-border relative z-10">
        <div className="space-y-12">
          <span className="font-space text-xs text-text-muted-dark tracking-widest block">// CAPABILITIES MATRICES</span>
          
          {/* TODO: Bind live assets and correct icons when build scripts are final */}
          <div className="space-y-8 font-space">
            
            {/* Category 1: Languages */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
              <span className="text-[10px] text-text-muted-dark tracking-widest">// LANGUAGES</span>
              <div className="md:col-span-3 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cream font-medium">
                <div className="flex items-center gap-1.5"><CodeIcon className="h-3.5 w-3.5 text-accent-red" /><span>TypeScript</span></div>
                <div className="flex items-center gap-1.5"><CodeIcon className="h-3.5 w-3.5 text-accent-red" /><span>JavaScript</span></div>
                <div className="flex items-center gap-1.5"><CodeIcon className="h-3.5 w-3.5 text-accent-red" /><span>Python</span></div>
                <div className="flex items-center gap-1.5"><CodeIcon className="h-3.5 w-3.5 text-accent-red" /><span>Solidity</span></div>
              </div>
            </div>

            {/* Category 2: Frameworks */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-4 border-t border-void-panel-border">
              <span className="text-[10px] text-text-muted-dark tracking-widest">// FRAMEWORKS</span>
              <div className="md:col-span-3 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cream font-medium">
                <div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-cream-dim" /><span>React / Next.js</span></div>
                <div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-cream-dim" /><span>NodeJS / Express</span></div>
                <div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-cream-dim" /><span>Tailwind CSS</span></div>
              </div>
            </div>

            {/* Category 3: Tools */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4 pt-4 border-t border-void-panel-border">
              <span className="text-[10px] text-text-muted-dark tracking-widest">// ENGINE TECHS</span>
              <div className="md:col-span-3 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cream font-medium">
                <div className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-cream-dim" /><span>PostgreSQL</span></div>
                <div className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-cream-dim" /><span>MongoDB</span></div>
                <div className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5 text-cream-dim" /><span>Pinecone VectorDB</span></div>
                <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-cream-dim" /><span>Zustand State</span></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Manifesto Inverted Quote Banner (Cream BG) */}
      <section className="bg-cream text-void py-24 md:py-32 relative z-10 select-none">
        <div className="max-w-5xl mx-auto px-6 text-left">
          <span className="font-space text-[10px] text-text-muted-cream tracking-widest block uppercase mb-6">// LOGICAL CORE MANIFESTO</span>
          {/* TODO: Add custom engineering values quote or personal placement values line */}
          <h3 className="font-anton text-4xl sm:text-7xl leading-[0.85] uppercase tracking-tighter text-void">
            WE MUST CULTIVATE SYSTEMIC SIMPLICITY AND REFUSE TRIVIAL DECORATION. THE MOST ELEGANT CODE IS THE ONE THAT EXECUTES WITH THE FEWEST BLOCKS.
          </h3>
          <span className="font-space text-xs text-accent-red tracking-widest block mt-8 select-none font-bold">// REF: SYSTEM-MINIMALISM.CONF</span>
        </div>
      </section>

      {/* Goals Timeline Section */}
      <section id="goals" className="max-w-6xl mx-auto px-6 py-32 border-t border-void-panel-border relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="font-space text-xs text-text-muted-dark tracking-widest block">// TRACKED OBJECTIVES</span>
            <h2 className="text-3xl font-anton tracking-tight text-cream uppercase leading-[0.9] text-4xl">Placement Milestones</h2>
            <p className="font-jakarta text-xs text-cream/60">
              I monitor learning readiness metrics to ensure alignment with target internships and key deadlines.
            </p>

            <Card className="border border-void-panel-border bg-void-panel p-5 space-y-4 rounded-[2px]">
              <div className="flex justify-between items-center">
                <span className="font-space text-[9px] text-text-muted-dark uppercase tracking-wider">Mission Target</span>
                <span className="text-[10px] text-cream bg-[#0c0b09] border border-void-panel-border px-2 py-0.5 rounded-[1px] font-space font-semibold">
                  {MOCK_CURRENT_MISSION.target}
                </span>
              </div>
              
              <h3 className="font-anton text-lg text-cream uppercase tracking-wide">{MOCK_CURRENT_MISSION.title}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-space text-text-muted-dark">
                  <span>READINESS COEFFICIENT</span>
                  <span>{MOCK_CURRENT_MISSION.progress}%</span>
                </div>
                <div className="h-[2px] w-full bg-[#0c0b09] rounded-full overflow-hidden">
                  <div className="h-full bg-cream transition-all duration-300" style={{ width: `${MOCK_CURRENT_MISSION.progress}%` }} />
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-anton text-lg text-cream uppercase tracking-wide flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-text-muted-dark" />
              <span>Target Checkpoints</span>
            </h3>

            {/* Dot Timeline */}
            <div className="border-l border-void-panel-border pl-6 space-y-8 py-2 ml-3">
              {MOCK_UPCOMING_EVENTS.map((event: UpcomingEvent) => (
                <div key={event.id} className="relative">
                  <span className={`absolute -left-[30px] top-1 h-2 w-2 rounded-full border border-void ${
                    event.type === "deadline" ? "bg-accent-red" : event.type === "interview" ? "bg-cream" : "bg-cream-dim"
                  }`} />
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-space text-text-muted-dark">{event.time}</span>
                      <span className={`text-[8px] uppercase tracking-wider font-semibold font-space px-1.5 py-0.2 rounded-[1px] border ${
                        event.type === "deadline" 
                          ? "bg-accent-red/10 text-accent-red border-accent-red/25" 
                          : "bg-cream/10 text-cream border-cream/25"
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-cream uppercase font-space tracking-wide">{event.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Canned Terminal CLI simulator */}
      <section className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        <Card className="border border-void-panel-border bg-void-panel rounded-[2px] overflow-hidden shadow-2xl">
          {/* Terminal Window Header */}
          <div className="bg-[#171613] px-4 py-2.5 flex items-center justify-between border-b border-void-panel-border">
            <div className="flex items-center gap-2 select-none">
              <div className="h-2.5 w-2.5 rounded-full bg-accent-red/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-cream-dim/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-cream/40" />
            </div>
            <span className="text-[10px] font-space text-text-muted-dark select-none">sh://manas.sh --interactive</span>
            <div className="w-10" />
          </div>

          {/* Screen */}
          <div className="p-5 font-space text-xs min-h-[180px] bg-[#0E0E0C] text-cream/90 space-y-1 overflow-y-auto max-h-[260px] select-text">
            {terminalLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={
                  log.startsWith("$") 
                    ? "text-cream font-bold" 
                    : log.startsWith("//") 
                      ? "text-text-muted-dark" 
                      : "text-cream-dim/80 pl-2"
                }
              >
                {log}
              </div>
            ))}
          </div>

          {/* Input Quick Commands */}
          <div className="flex bg-[#151412] border-t border-void-panel-border text-[10px] font-space select-none">
            {(["story", "projects", "contact", "clear"] as const).map((cmd) => (
              <button
                key={cmd}
                onClick={() => runTerminalCommand(cmd)}
                className={`px-4 py-2 border-r border-void-panel-border hover:bg-void hover:text-white transition-colors cursor-pointer uppercase ${
                  cmd === "clear" ? "text-accent-red ml-auto border-l border-r-0" : "text-cream-dim"
                }`}
              >
                // RUN {cmd}
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* Contact Form & System Unlock Console */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-32 border-t border-void-panel-border relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Mock Contact form */}
          <div className="lg:col-span-6 space-y-6">
            <span className="font-space text-xs text-text-muted-dark tracking-widest block">// PING ROUTER</span>
            <h2 className="text-3xl font-anton tracking-tight text-cream uppercase leading-[0.9] text-4xl">Send Message</h2>
            <p className="font-jakarta text-xs text-cream/60">
              Submit a routing packet directly to the developer queue. Responses will trigger via normal SMTP hooks.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4 font-space text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-text-muted-dark tracking-wider block uppercase">// SENDER NAME</label>
                <Input 
                  placeholder="E.g. John Doe" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  disabled={isContactSubmitted}
                  className="bg-void-panel border-void-panel-border rounded-[2px] focus-visible:border-cream/30 text-cream"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-text-muted-dark tracking-wider block uppercase">// SENDER EMAIL</label>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  disabled={isContactSubmitted}
                  className="bg-void-panel border-void-panel-border rounded-[2px] focus-visible:border-cream/30 text-cream"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-text-muted-dark tracking-wider block uppercase">// PACKET MESSAGE</label>
                <Textarea 
                  placeholder="Hi Manas, let's connect regarding..." 
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  disabled={isContactSubmitted}
                  className="bg-void-panel border-void-panel-border rounded-[2px] focus-visible:border-cream/30 text-cream resize-none font-space text-xs"
                  required
                />
              </div>

              {isContactSubmitted ? (
                <div className="flex items-center gap-2 text-cream bg-cream/10 border border-void-panel-border p-3 rounded-[2px]">
                  <CheckCircle className="h-4 w-4 shrink-0 text-accent-red" />
                  <span>// MESSAGE PACKET MOCKED SUCCESSFULLY.</span>
                </div>
              ) : (
                <Button type="submit" variant="secondary" className="w-full justify-center gap-2 border-void-panel-border bg-void-panel hover:bg-void hover:border-cream/40 rounded-[2px] font-space text-xs text-cream cursor-pointer">
                  <span>SEND PACKET</span>
                  <ChevronRight className="h-4 w-4 text-accent-red" />
                </Button>
              )}
            </form>
          </div>

          {/* System Unlock Terminal Console */}
          <div id="unlock-card" className="lg:col-span-6 space-y-6">
            <span className="font-space text-xs text-text-muted-dark tracking-widest block">// SYS DESKTOP AUTHENTICATION</span>
            <h2 className="text-3xl font-anton tracking-tight text-cream uppercase leading-[0.9] text-4xl">Authorization Console</h2>
            <p className="font-jakarta text-xs text-cream/60">
              The primary developer workspace is locked. Enter the bypass token to unlock layout pages.
            </p>

            <Card className="border border-void-panel-border bg-void-panel p-6 rounded-[2px] space-y-5">
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-space text-text-muted-dark flex items-center justify-between uppercase">
                    <span>// ENCRYPTION TOKEN</span>
                    <span className="text-accent-red flex items-center gap-1">
                      <Lock className="h-3 w-3" /> SHA-256 COMPARE
                    </span>
                  </label>
                  
                  <div className="flex gap-2">
                    <Input 
                      type="password" 
                      placeholder="ENTER TOKEN KEY..." 
                      value={unlockCode}
                      onChange={(e) => {
                        setUnlockCode(e.target.value)
                        setUnlockError("")
                      }}
                      disabled={isUnlocking}
                      className="font-space text-center uppercase tracking-widest bg-void border-void-panel-border rounded-[2px] text-cream"
                      error={!!unlockError}
                      required
                    />
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={isUnlocking} 
                      className="shrink-0 bg-cream text-void rounded-[2px] hover:bg-cream-dim font-space text-xs cursor-pointer"
                    >
                      {isUnlocking ? "CHECK..." : "UNLOCK"}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Tips & Bypass Code Alert */}
              <div className="bg-void border border-void-panel-border rounded-[2px] p-4 flex items-start gap-3 select-none">
                <AlertCircle className="h-4 w-4 text-accent-red shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1 text-xs leading-normal font-space">
                  <h4 className="font-semibold text-cream uppercase">// BYPASS KEY FOUND</h4>
                  <p className="text-text-muted-cream text-[11px] font-jakarta leading-relaxed">
                    To authorize local pages layout access, input the case-insensitive token <code className="text-cream bg-void-panel border border-void-panel-border px-1.5 py-0.5 rounded-[1px] font-space">CodePirate</code> in the box above.
                  </p>
                </div>
              </div>

              {/* Decryption status panel */}
              {unlockLogs.length > 0 && (
                <div className="bg-[#0E0E0C] border border-void-panel-border rounded-[2px] p-4 font-space text-[10px] text-cream-dim space-y-1 select-none min-h-[90px]">
                  {unlockLogs.map((log, i) => (
                    <div 
                      key={i} 
                      className={
                        log.startsWith("[error]") 
                          ? "text-accent-red" 
                          : log.startsWith("[auth]") 
                            ? "text-cream font-semibold" 
                            : "text-text-muted-cream"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-void-panel border-t border-void-panel-border py-8 text-center text-[10px] text-text-muted-dark font-space select-none relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-cream">// MANAS.OS</span>
            <span>v1.0.0</span>
          </div>
          <div className="flex items-center gap-1">
            <span>DESIGNED FOR SECURE DEVELOPMENT WORKSPACES</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
