import { create } from 'zustand'

interface PreloaderState {
  isOpen: boolean
  isSuccess: boolean
  openPreloader: () => void
  setSuccess: () => void
  closePreloader: () => void
}

export const usePreloaderStore = create<PreloaderState>((set) => ({
  isOpen: false,
  isSuccess: false,
  openPreloader: () => set({ isOpen: true, isSuccess: false }),
  setSuccess: () => set({ isSuccess: true }),
  closePreloader: () => set({ isOpen: false, isSuccess: false }),
}))
