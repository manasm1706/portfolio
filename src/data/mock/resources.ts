export interface Resource {
  id: string
  title: string
  description: string
  category: "DSA" | "SQL" | "System Design" | "AI" | "React" | "Backend" | "Android" | "Unity" | "Interview Prep"
  status: "Saved" | "Learning" | "Mastered"
  tags: string[]
  url: string
}

export const MOCK_RESOURCES: Resource[] = [
  // DSA
  {
    id: "r-dsa-1",
    title: "NeetCode 150",
    description: "A curated list of 150 important LeetCode coding interview questions covering core data structures.",
    category: "DSA",
    status: "Saved",
    tags: ["LeetCode", "Algorithms", "Study Plan"],
    url: "https://neetcode.io/practice"
  },
  {
    id: "r-dsa-2",
    title: "Algorithms: Graph Playlist",
    description: "In-depth video tutorials covering BFS, DFS, Dijkstra, Bellman-Ford, and Union Find algorithms.",
    category: "DSA",
    status: "Learning",
    tags: ["Graphs", "BFS/DFS", "Shortest Path"],
    url: "https://github.com/manasm1706"
  },
  {
    id: "r-dsa-3",
    title: "Dynamic Programming Notes",
    description: "Personal handbook summarizing memoization, tabulation, and bottom-up DP approaches.",
    category: "DSA",
    status: "Mastered",
    tags: ["DP", "Optimization", "Recursion"],
    url: "https://github.com/manasm1706"
  },
  {
    id: "r-dsa-4",
    title: "Trees Cheat Sheet",
    description: "Quick revision guides covering binary search trees, AVL trees, and traversals (inorder, preorder).",
    category: "DSA",
    status: "Saved",
    tags: ["Trees", "BST", "Cheat Sheet"],
    url: "https://github.com/manasm1706"
  },

  // SQL
  {
    id: "r-sql-1",
    title: "SQLBolt Interactive Lessons",
    description: "Introductory tutorial using interactive SQL commands directly in the browser.",
    category: "SQL",
    status: "Mastered",
    tags: ["SQL", "Joins", "Queries", "Interactive"],
    url: "https://sqlbolt.com/"
  },
  {
    id: "r-sql-2",
    title: "Window Functions Guide",
    description: "Advanced query tutorial detailing ROW_NUMBER, RANK, DENSE_RANK, and PARTITION BY clauses.",
    category: "SQL",
    status: "Learning",
    tags: ["SQL", "Analytics", "Aggregations"],
    url: "https://github.com/manasm1706"
  },
  {
    id: "r-sql-3",
    title: "LeetCode SQL 50",
    description: "Interactive practice track resolving the 50 most common database query interview problems.",
    category: "SQL",
    status: "Saved",
    tags: ["SQL", "LeetCode", "Database"],
    url: "https://leetcode.com/studyplan/30-days-of-lc-sql/"
  },

  // System Design
  {
    id: "r-sd-1",
    title: "ByteByteGo System Design",
    description: "Detailed visual blueprints covering caches, CDN, load balancers, and distributed systems.",
    category: "System Design",
    status: "Saved",
    tags: ["Scaling", "Architecture", "Microservices"],
    url: "https://bytebytego.com/"
  },
  {
    id: "r-sd-2",
    title: "System Design Primer",
    description: "Open-source reference guide detailing scalability, performance bottlenecks, and database choices.",
    category: "System Design",
    status: "Learning",
    tags: ["Open Source", "Scaling", "System Design"],
    url: "https://github.com/donnemartin/system-design-primer"
  },
  {
    id: "r-sd-3",
    title: "REST API Design Checklist",
    description: "Guidelines detailing status codes, versioning, routing, security, and payload structures.",
    category: "System Design",
    status: "Saved",
    tags: ["API", "REST", "JSON", "Security"],
    url: "https://github.com/manasm1706"
  },

  // AI
  {
    id: "r-ai-1",
    title: "Pinecone Vector Search",
    description: "Hands-on guidelines for configuring vector indices, similarity queries, and cosine matching.",
    category: "AI",
    status: "Learning",
    tags: ["Pinecone", "Vector DB", "Embeddings"],
    url: "https://docs.pinecone.io/"
  },
  {
    id: "r-ai-2",
    title: "ML-based pricing models",
    description: "Case studies detailing regression models and neural nets for real-time demand curves.",
    category: "AI",
    status: "Mastered",
    tags: ["ML Engine", "Regression", "Pricing"],
    url: "https://github.com/manasm1706/Reprice-Master-Repo"
  },

  // React
  {
    id: "r-re-1",
    title: "React.dev Guidelines",
    description: "The official React documentation detailing state hooks, effects, and modern API modules.",
    category: "React",
    status: "Mastered",
    tags: ["React", "State", "Hooks", "Official"],
    url: "https://react.dev/"
  },
  {
    id: "r-re-2",
    title: "Dan Abramov's Overreacted",
    description: "Personal developer blog detailing deep dives into React rendering cycles and mental models.",
    category: "React",
    status: "Saved",
    tags: ["Rendering", "State", "Blog"],
    url: "https://overreacted.io/"
  },
  {
    id: "r-re-3",
    title: "React 19 compiler features",
    description: "Deep dive review on the automatic memoization engine and compiler behaviors.",
    category: "React",
    status: "Learning",
    tags: ["React 19", "Compiler", "Performance"],
    url: "https://react.dev/blog/2024/12/05/react-19"
  },

  // Backend
  {
    id: "r-be-1",
    title: "Node.js Best Practices",
    description: "The primary community-driven guide outlining error handling, code organization, and safety.",
    category: "Backend",
    status: "Mastered",
    tags: ["NodeJS", "Express", "Production", "Best Practices"],
    url: "https://github.com/goldbergyoni/nodebestpractices"
  },
  {
    id: "r-be-2",
    title: "Express Middleware Guide",
    description: "Tutorial detailing router middleware layers, error-catching handlers, and body parsing.",
    category: "Backend",
    status: "Saved",
    tags: ["Express", "Middleware", "Routing"],
    url: "https://expressjs.com/"
  },

  // Android
  {
    id: "r-and-1",
    title: "Kotlin Developer Guide",
    description: "Official guide mapping Kotlin syntax, coroutines, memory layout, and scoping utilities.",
    category: "Android",
    status: "Learning",
    tags: ["Kotlin", "Coroutines", "Android"],
    url: "https://kotlinlang.org/docs/home.html"
  },
  {
    id: "r-and-2",
    title: "Expo & React Native Guidelines",
    description: "Manual detailing fast-build setups, navigation routers, and local hardware scanners.",
    category: "Android",
    status: "Mastered",
    tags: ["Expo", "React Native", "Scanner SDK"],
    url: "https://docs.expo.dev/"
  },

  // Unity
  {
    id: "r-un-1",
    title: "HTML5 Canvas retro game details",
    description: "Case studies on sprites sheet slicing, frame rates rendering, and collision buffers.",
    category: "Unity",
    status: "Mastered",
    tags: ["Canvas API", "retro", "Sprite Sheets"],
    url: "https://manasm1706.github.io/pirates"
  },

  // Interview Prep
  {
    id: "r-ip-1",
    title: "Google STEP Interview syllabus",
    description: "Syllabus details mapping data structure focus weights, search paths, and complexity constraints.",
    category: "Interview Prep",
    status: "Learning",
    tags: ["Google STEP", "Syllabus", "Algorithms"],
    url: "https://github.com/manasm1706"
  },
  {
    id: "r-ip-2",
    title: "Flipkart GRID past challenges",
    description: "Review repository notes on past Flipkart GRID e-commerce coding challenges and topics.",
    category: "Interview Prep",
    status: "Saved",
    tags: ["Flipkart GRID", "Past Papers", "Notes"],
    url: "https://github.com/manasm1706"
  }
]
