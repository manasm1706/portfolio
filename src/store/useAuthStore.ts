import { create } from "zustand"

interface AuthState {
  isUnlocked: boolean
  unlock: (code: string) => Promise<boolean>
  lock: () => void
}

// SHA-256 hash of "codepirate"
const HASHED_CODE = "40da87cca20f396cae54f79426e405c027c18bd1d8823a27d7f1e70596333df5"

// Helper to compute SHA-256 hash of a string
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const useAuthStore = create<AuthState>((set) => ({
  isUnlocked: localStorage.getItem("career_os_unlocked") === "true",
  unlock: async (code: string) => {
    const sanitized = code.trim().toLowerCase()
    const hashed = await sha256(sanitized)
    
    if (hashed === HASHED_CODE) {
      localStorage.setItem("career_os_unlocked", "true")
      set({ isUnlocked: true })
      return true
    }
    return false
  },
  lock: () => {
    localStorage.removeItem("career_os_unlocked")
    set({ isUnlocked: false })
  },
}))
