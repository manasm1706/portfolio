export interface GithubLanguage {
  name: string
  percentage: number
  color: string
}

export interface GithubStats {
  username: string
  profileUrl: string
  totalStars: number
  totalRepos: number
  streak: number
  longestStreak: number
  totalContributions: number
  languages: GithubLanguage[]
  recentRepos: { name: string; url: string; language: string; stars: number }[]
}

export interface LeetcodeStats {
  username: string
  profileUrl: string
  solvedCount: { easy: number; medium: number; hard: number; total: number }
  streak: number
  maxStreak: number
  activeDays: number
  contestRating?: string
  contestRanking?: string
}

export interface FocusArea {
  name: string
  progress: number
}

export interface ShortcutLink {
  name: string
  url: string
  isPlaceholder?: boolean
}

export const MOCK_GITHUB_STATS: GithubStats = {
  username: "manasm1706",
  profileUrl: "https://github.com/manasm1706",
  totalStars: 28,
  totalRepos: 18,
  streak: 0,
  longestStreak: 7,
  totalContributions: 345,
  languages: [
    { name: "TypeScript", percentage: 35.05, color: "#3178c6" },
    { name: "JavaScript", percentage: 25.30, color: "#f1e05a" },
    { name: "Jupyter Notebook", percentage: 24.98, color: "#da5b0b" },
    { name: "Kotlin", percentage: 7.19, color: "#A97BFF" },
    { name: "CSS", percentage: 6.46, color: "#563d7c" },
    { name: "Python", percentage: 1.01, color: "#3572A5" }
  ],
  recentRepos: [
    { name: "Reprice-Master-Repo", url: "https://github.com/manasm1706/Reprice-Master-Repo", language: "JavaScript", stars: 12 },
    { name: "PharmaWare-Invictus", url: "https://github.com/manasm1706/PharmaWare-Invictus", language: "JavaScript", stars: 5 },
    { name: "labournet", url: "https://github.com/manasm1706/labournet", language: "JavaScript", stars: 3 },
    { name: "chronovault", url: "https://github.com/manasm1706/chronovault", language: "TypeScript", stars: 2 }
  ]
}

export const MOCK_LEETCODE_STATS: LeetcodeStats = {
  username: "CodePirate_127",
  profileUrl: "https://leetcode.com/u/CodePirate_127/",
  solvedCount: { easy: 7, medium: 19, hard: 5, total: 31 },
  streak: 0,
  maxStreak: 3,
  activeDays: 20,
  contestRating: "Not Available",
  contestRanking: "Not Available"
}

export const MOCK_FOCUS_AREAS: FocusArea[] = [
  { name: "Graphs", progress: 75 },
  { name: "Dynamic Programming", progress: 50 },
  { name: "System Design", progress: 60 },
  { name: "Backend Development", progress: 85 },
  { name: "React Architecture", progress: 90 }
]

export const MOCK_SHORTCUT_LINKS: ShortcutLink[] = [
  { name: "GitHub", url: "https://github.com/manasm1706" },
  { name: "LeetCode", url: "https://leetcode.com/u/CodePirate_127/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/manas-mungekar-14007a28b/" },
  { name: "Devfolio", url: "#", isPlaceholder: true },
  { name: "Unstop", url: "#", isPlaceholder: true },
  { name: "Codeforces", url: "#", isPlaceholder: true },
  { name: "CodeChef", url: "#", isPlaceholder: true },
  { name: "HackerRank", url: "#", isPlaceholder: true }
]
