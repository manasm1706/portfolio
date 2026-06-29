export interface Opportunity {
  id: string
  title: string
  company: string
  category: "internship" | "hackathon" | "open-source"
  status: "Target" | "In Progress" | "Completed" | "Closed"
  statusLabel: string
  deadline: string
  dsaReadiness: number
  projectsReadiness: number
  description: string
  notes: string
  skills: string[]
  checklist: { id: string; text: string; completed: boolean }[]
  externalUrl?: string
}

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Flipkart GRID 8.0",
    company: "Flipkart",
    category: "hackathon",
    status: "In Progress",
    statusLabel: "Preparing",
    deadline: "July 10, 2026",
    dsaReadiness: 65,
    projectsReadiness: 90,
    description: "National level engineering challenge focusing on ecommerce search, ML pricing models, and system scale architecture.",
    notes: "Targeting the ML track. Need to focus on vector database queries and system scale benchmarks.",
    skills: ["ML Models", "Vector DB", "System Design"],
    checklist: [
      { id: "grid-c1", text: "Submit Round 1 Team Proposal", completed: false },
      { id: "grid-c2", text: "Benchmark Pinecone retrieval latency", completed: false },
      { id: "grid-c3", text: "Review advanced graph algorithms on LeetCode", completed: true }
    ],
    externalUrl: "https://github.com/manasm1706/Reprice-Master-Repo"
  },
  {
    id: "opp-2",
    title: "Google STEP Internship",
    company: "Google",
    category: "internship",
    status: "Target",
    statusLabel: "Applied",
    deadline: "July 15, 2026",
    dsaReadiness: 70,
    projectsReadiness: 85,
    description: "Development internship program designed for second-year computer engineering students.",
    notes: "Interviews will focus heavily on core DSA, especially Trees, Graphs, and HashMaps.",
    skills: ["DSA", "Java", "Python"],
    checklist: [
      { id: "step-c1", text: "LeetCode Graph study plan (15 problems)", completed: false },
      { id: "step-c2", text: "Conduct mock interview prep session", completed: false },
      { id: "step-c3", text: "Align resume details with Reprice AI metrics", completed: true }
    ],
    externalUrl: "https://leetcode.com/u/CodePirate_127/"
  },
  {
    id: "opp-3",
    title: "Eagle Electrical Intern",
    company: "Eagle Electrical Systems",
    category: "internship",
    status: "Completed",
    statusLabel: "Completed",
    deadline: "June 2026",
    dsaReadiness: 60,
    projectsReadiness: 95,
    description: "Built Reprice AI, a machine learning pricing optimization system utilizing Pinecone and SQL database layers.",
    notes: "Internship completed successfully. Gained deep experience with ML model latency and vector index optimization.",
    skills: ["React", "NodeJS", "ML Pricing", "Pinecone"],
    checklist: [
      { id: "eagle-c1", text: "Complete Reprice AI dashboard features", completed: true },
      { id: "eagle-c2", text: "Connect NeonDB SQL storage layers", completed: true },
      { id: "eagle-c3", text: "Implement ML pricing query controller", completed: true }
    ],
    externalUrl: "https://github.com/manasm1706/Reprice-Master-Repo"
  },
  {
    id: "opp-4",
    title: "Megasys App Intern",
    company: "Megasys India",
    category: "internship",
    status: "Completed",
    statusLabel: "Completed",
    deadline: "Jan 2026",
    dsaReadiness: 50,
    projectsReadiness: 80,
    description: "Developed Expo/React Native codebases and authentication features for secure local scanning modules.",
    notes: "First internship. Focused on modular screens, component performance, and mobile session safety.",
    skills: ["React Native", "Expo", "API Auth", "Scanner SDK"],
    checklist: [
      { id: "mega-c1", text: "Code user session storage in Expo", completed: true },
      { id: "mega-c2", text: "Implement offline scanning buffers", completed: true }
    ]
  },
  {
    id: "opp-5",
    title: "LabourNet Contributor",
    company: "LabourNet",
    category: "open-source",
    status: "In Progress",
    statusLabel: "Active",
    deadline: "July 8, 2026",
    dsaReadiness: 40,
    projectsReadiness: 90,
    description: "Contractor posting portal connecting construction teams to local builders and jobs.",
    notes: "Focusing on workflow state machine optimizations and UI details.",
    skills: ["React", "MongoDB", "Express", "NodeJS"],
    checklist: [
      { id: "lab-c1", text: "Deploy contractor profile registry", completed: false },
      { id: "lab-c2", text: "Implement local job applications controller", completed: false }
    ],
    externalUrl: "https://github.com/manasm1706/labournet"
  }
]
