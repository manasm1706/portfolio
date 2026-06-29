import { create } from "zustand"

interface CommandPaletteState {
  isOpen: boolean
  setOpen: (val: boolean) => void
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  setOpen: (val) => set({ isOpen: val }),
}))
