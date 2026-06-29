export interface ProjectLink {
  name: string
  url: string
}

export interface Project {
  id: string
  title: string
  description: string
  progress: number
  phase?: string
  technologies: string[]
  status: "Featured" | "Active" | "Completed"
  statusLabel: string
  lastUpdated: string
  links: ProjectLink[]
  achievement?: string
}

export const MOCK_FEATURED_PROJECT: Project = {
  id: "proj-featured",
  title: "CareerOS",
  description: "A premium, unified personal developer operating system aggregating calendars, opportunities, repository stats, and project builds into one calm, fast, visual workspace.",
  progress: 68,
  phase: "Phase 3: Core Workspace Pages",
  technologies: ["React", "TypeScript", "Tailwind CSS v4", "Zustand", "Radix UI"],
  status: "Featured",
  statusLabel: "Active Development",
  lastUpdated: "2 hours ago",
  links: [
    { name: "GitHub", url: "https://github.com/manasm1706" },
    { name: "Documentation", url: "https://github.com/manasm1706" },
    { name: "Design", url: "https://github.com/manasm1706" }
  ]
}

export const MOCK_ACTIVE_PROJECTS: Project[] = [
  {
    id: "proj-active-1",
    title: "CareerOS",
    description: "Personal developer operating system integrating calendars, opportunities, and stats.",
    progress: 68,
    technologies: ["React", "TypeScript", "Tailwind CSS v4", "Zustand"],
    status: "Active",
    statusLabel: "In Progress",
    lastUpdated: "2 hours ago",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706" }
    ]
  },
  {
    id: "proj-active-2",
    title: "SafeReady",
    description: "Full-stack security management platform utilizing vector DB search algorithms.",
    progress: 82,
    technologies: ["React", "Node.js", "Express", "NeonDB", "Pinecone"],
    status: "Active",
    statusLabel: "In Progress",
    lastUpdated: "Yesterday",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706" }
    ]
  },
  {
    id: "proj-active-3",
    title: "Resume Portfolio",
    description: "Personal portfolio displaying software engineering case studies and active modules.",
    progress: 45,
    technologies: ["Vite", "React", "Tailwind CSS", "Framer Motion"],
    status: "Active",
    statusLabel: "In Progress",
    lastUpdated: "3 days ago",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706" }
    ]
  }
]

export const MOCK_COMPLETED_PROJECTS: Project[] = [
  {
    id: "proj-comp-1",
    title: "Reprice AI",
    description: "Intelligent pricing engine utilizing real-time data analysis & vector embeddings.",
    progress: 100,
    technologies: ["React", "NodeJS", "NeonDB", "Pinecone"],
    status: "Completed",
    statusLabel: "Completed",
    lastUpdated: "Completed (June 2026)",
    achievement: "ML-based Pricing System",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706/Reprice-Master-Repo" }
    ]
  },
  {
    id: "proj-comp-2",
    title: "PharmaWare",
    description: "Smart medication management platform with secure user authentication.",
    progress: 100,
    technologies: ["Node.js", "Express", "MongoDB Atlas", "React"],
    status: "Completed",
    statusLabel: "Completed",
    lastUpdated: "Completed (Feb 2026)",
    achievement: "Top 5 Hackathon Winner",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706/PharmaWare-Invictus" }
    ]
  },
  {
    id: "proj-comp-3",
    title: "LabourNet",
    description: "MERN stack platform connecting workers & construction contractors directly.",
    progress: 100,
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    status: "Completed",
    statusLabel: "Completed",
    lastUpdated: "Completed (Dec 2025)",
    achievement: "Construction Service Platform",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706/labournet" }
    ]
  },
  {
    id: "proj-comp-4",
    title: "Disaster Relief DApp",
    description: "Blockchain-based disaster fund collection system ensuring high transparency.",
    progress: 100,
    technologies: ["React", "Solidity", "Web3", "Ethereum"],
    status: "Completed",
    statusLabel: "Completed",
    lastUpdated: "Completed (Nov 2025)",
    achievement: "Web3 Disaster Relief",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706/disaster-dapp" }
    ]
  },
  {
    id: "proj-comp-5",
    title: "ChronoVault",
    description: "Secure memory vault application with chat-based interaction interfaces.",
    progress: 100,
    technologies: ["Vite", "React", "CSS", "Local Storage"],
    status: "Completed",
    statusLabel: "Completed",
    lastUpdated: "Completed (Sept 2025)",
    achievement: "Interactive Chat-Vault",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706/chronovault" }
    ]
  },
  {
    id: "proj-comp-6",
    title: "Shinigami Bin",
    description: "Pager-based paste bin system built for KiroWeen Hackathon challenges.",
    progress: 100,
    technologies: ["Node.js", "JavaScript", "HTML", "CSS"],
    status: "Completed",
    statusLabel: "Completed",
    lastUpdated: "Completed (Oct 2025)",
    achievement: "KiroWeen Hackathon",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706/shinigami-bin" }
    ]
  },
  {
    id: "proj-comp-7",
    title: "AstroView",
    description: "Space-based astronomy hub built for Invictus'26 Hackathon presentation.",
    progress: 100,
    technologies: ["HTML5", "CSS3", "JavaScript"],
    status: "Completed",
    statusLabel: "Completed",
    lastUpdated: "Completed (Feb 2026)",
    achievement: "Invictus'26 Hackathon",
    links: [
      { name: "GitHub", url: "https://github.com/manasm1706/astroview" }
    ]
  },
  {
    id: "proj-comp-8",
    title: "Pirates",
    description: "A fast-paced browser retro pirate battle game built with HTML5 Canvas API.",
    progress: 100,
    technologies: ["HTML5 Canvas", "JavaScript"],
    status: "Completed",
    statusLabel: "Completed",
    lastUpdated: "Completed (Aug 2025)",
    achievement: "Retro Browser Game",
    links: [
      { name: "Live Play", url: "https://manasm1706.github.io/pirates" }
    ]
  }
]

export const MOCK_TECH_STACK = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "Python", "Java", "HTML", "CSS"] },
  { category: "Frameworks & Runtimes", items: ["React", "React Native", "Node.js", "Express", "ASP.NET"] },
  { category: "Databases & AI", items: ["MongoDB", "PostgreSQL", "Supabase", "Firebase", "Pinecone"] },
  { category: "Tools", items: ["Git", "GitHub", "Linux", "VSCode", "Expo"] }
]

export const MOCK_RECENTLY_UPDATED = [
  { name: "CareerOS", time: "2 hours ago", repo: "manasm1706/career-os" },
  { name: "SafeReady", time: "Yesterday", repo: "manasm1706/SafeReady" },
  { name: "Resume Portfolio", time: "3 days ago", repo: "manasm1706/resume-portfolio" }
]
